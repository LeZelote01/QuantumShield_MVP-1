#!/usr/bin/env python3
"""
📊 Monitoring QuantumShield en Production
Surveille la santé de l'application déployée
"""

import requests
import time
import json
from datetime import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

class QuantumShieldMonitor:
    def __init__(self, config_file="monitoring_config.json"):
        self.config = self.load_config(config_file)
        self.alerts_sent = {}
        
    def load_config(self, config_file):
        """Charge la configuration ou crée une configuration par défaut"""
        try:
            with open(config_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            # Configuration par défaut
            default_config = {
                "services": {
                    "backend": "https://your-app.railway.app",
                    "frontend": "https://your-app.vercel.app"
                },
                "monitoring": {
                    "interval_seconds": 300,  # 5 minutes
                    "timeout_seconds": 10,
                    "max_retries": 3
                },
                "alerts": {
                    "email_enabled": False,
                    "email_smtp": "smtp.gmail.com",
                    "email_port": 587,
                    "email_username": "",
                    "email_password": "",
                    "email_recipients": []
                },
                "thresholds": {
                    "response_time_warning": 2.0,  # secondes
                    "response_time_critical": 5.0
                }
            }
            
            with open(config_file, 'w') as f:
                json.dump(default_config, f, indent=2)
            
            print(f"📝 Configuration créée: {config_file}")
            print("⚠️  Veuillez modifier la configuration avec vos URLs")
            return default_config

    def check_service(self, name, url):
        """Vérifie un service spécifique"""
        start_time = time.time()
        
        try:
            if name == "backend":
                response = requests.get(f"{url}/api/health", 
                                      timeout=self.config["monitoring"]["timeout_seconds"])
            else:
                response = requests.get(url, 
                                      timeout=self.config["monitoring"]["timeout_seconds"])
            
            response_time = time.time() - start_time
            
            status = {
                "service": name,
                "url": url,
                "status": "UP" if response.status_code == 200 else "DOWN",
                "response_code": response.status_code,
                "response_time": round(response_time, 2),
                "timestamp": datetime.now().isoformat()
            }
            
            # Vérifications spécifiques au backend
            if name == "backend" and response.status_code == 200:
                try:
                    data = response.json()
                    status["healthy"] = data.get("status") == "healthy"
                    status["services"] = data.get("services", {})
                except:
                    status["healthy"] = False
            
            return status
            
        except requests.exceptions.Timeout:
            return {
                "service": name,
                "url": url,
                "status": "TIMEOUT",
                "response_code": None,
                "response_time": self.config["monitoring"]["timeout_seconds"],
                "timestamp": datetime.now().isoformat(),
                "error": "Request timeout"
            }
        except Exception as e:
            return {
                "service": name,
                "url": url,
                "status": "ERROR",
                "response_code": None,
                "response_time": None,
                "timestamp": datetime.now().isoformat(),
                "error": str(e)
            }

    def check_all_services(self):
        """Vérifie tous les services configurés"""
        results = []
        
        for service_name, service_url in self.config["services"].items():
            if service_url and service_url != "https://your-app.railway.app":
                result = self.check_service(service_name, service_url)
                results.append(result)
                
                # Affichage du statut
                status_icon = "✅" if result["status"] == "UP" else "❌"
                print(f"{status_icon} {service_name.upper()}: {result['status']} "
                      f"({result.get('response_time', 'N/A')}s)")
                
                # Vérifier les seuils de performance
                if result.get("response_time"):
                    if result["response_time"] > self.config["thresholds"]["response_time_critical"]:
                        print(f"🚨 {service_name}: Temps de réponse critique ({result['response_time']}s)")
                    elif result["response_time"] > self.config["thresholds"]["response_time_warning"]:
                        print(f"⚠️  {service_name}: Temps de réponse lent ({result['response_time']}s)")
        
        return results

    def send_alert(self, service_name, status):
        """Envoie une alerte email si configuré"""
        if not self.config["alerts"]["email_enabled"]:
            return
        
        # Éviter le spam d'alertes
        alert_key = f"{service_name}_{status['status']}"
        current_time = time.time()
        
        if alert_key in self.alerts_sent:
            if current_time - self.alerts_sent[alert_key] < 3600:  # 1 heure
                return
        
        self.alerts_sent[alert_key] = current_time
        
        try:
            msg = MIMEMultipart()
            msg['From'] = self.config["alerts"]["email_username"]
            msg['To'] = ", ".join(self.config["alerts"]["email_recipients"])
            msg['Subject'] = f"🚨 QuantumShield Alert: {service_name} is {status['status']}"
            
            body = f"""
Service: {service_name}
Status: {status['status']}
URL: {status['url']}
Response Code: {status.get('response_code', 'N/A')}
Response Time: {status.get('response_time', 'N/A')}s
Error: {status.get('error', 'None')}
Timestamp: {status['timestamp']}

Please check your deployment immediately.
            """
            
            msg.attach(MIMEText(body, 'plain'))
            
            server = smtplib.SMTP(self.config["alerts"]["email_smtp"], 
                                self.config["alerts"]["email_port"])
            server.starttls()
            server.login(self.config["alerts"]["email_username"], 
                        self.config["alerts"]["email_password"])
            
            text = msg.as_string()
            server.sendmail(self.config["alerts"]["email_username"], 
                          self.config["alerts"]["email_recipients"], text)
            server.quit()
            
            print(f"📧 Alerte envoyée pour {service_name}")
            
        except Exception as e:
            print(f"❌ Erreur envoi email: {e}")

    def save_metrics(self, results):
        """Sauvegarde les métriques dans un fichier"""
        metrics_file = f"metrics_{datetime.now().strftime('%Y%m%d')}.jsonl"
        
        with open(metrics_file, 'a') as f:
            for result in results:
                f.write(json.dumps(result) + '\n')

    def generate_daily_report(self):
        """Génère un rapport quotidien"""
        today = datetime.now().strftime('%Y%m%d')
        metrics_file = f"metrics_{today}.jsonl"
        
        try:
            with open(metrics_file, 'r') as f:
                metrics = [json.loads(line) for line in f]
            
            if not metrics:
                return
            
            # Calcul des statistiques
            services = {}
            for metric in metrics:
                service_name = metric['service']
                if service_name not in services:
                    services[service_name] = {
                        'total_checks': 0,
                        'successful_checks': 0,
                        'response_times': []
                    }
                
                services[service_name]['total_checks'] += 1
                if metric['status'] == 'UP':
                    services[service_name]['successful_checks'] += 1
                
                if metric.get('response_time'):
                    services[service_name]['response_times'].append(metric['response_time'])
            
            # Génération du rapport
            report = f"\n📊 RAPPORT QUOTIDIEN - {today}\n" + "="*50 + "\n"
            
            for service_name, stats in services.items():
                uptime = (stats['successful_checks'] / stats['total_checks']) * 100
                avg_response_time = sum(stats['response_times']) / len(stats['response_times']) if stats['response_times'] else 0
                
                report += f"\n🔧 {service_name.upper()}:\n"
                report += f"   Uptime: {uptime:.1f}% ({stats['successful_checks']}/{stats['total_checks']})\n"
                report += f"   Temps réponse moyen: {avg_response_time:.2f}s\n"
            
            print(report)
            
            # Sauvegarder le rapport
            with open(f"daily_report_{today}.txt", 'w') as f:
                f.write(report)
                
        except FileNotFoundError:
            print("📊 Aucune métrique disponible pour le rapport quotidien")

    def run_monitoring_loop(self):
        """Boucle de monitoring principal"""
        print("🔍 Démarrage du monitoring QuantumShield")
        print(f"📊 Intervalle: {self.config['monitoring']['interval_seconds']}s")
        print("="*50)
        
        try:
            while True:
                print(f"\n⏰ {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
                
                results = self.check_all_services()
                
                # Sauvegarder les métriques
                self.save_metrics(results)
                
                # Envoyer des alertes si nécessaire
                for result in results:
                    if result["status"] != "UP":
                        self.send_alert(result["service"], result)
                
                # Attendre avant le prochain check
                time.sleep(self.config["monitoring"]["interval_seconds"])
                
        except KeyboardInterrupt:
            print("\n🛑 Monitoring arrêté par l'utilisateur")
            self.generate_daily_report()

    def run_single_check(self):
        """Effectue un check unique"""
        print("🔍 Check unique des services QuantumShield")
        print("="*50)
        
        results = self.check_all_services()
        self.save_metrics(results)
        
        # Résumé
        up_count = sum(1 for r in results if r["status"] == "UP")
        total_count = len(results)
        
        print(f"\n📊 Résumé: {up_count}/{total_count} services opérationnels")
        
        return up_count == total_count

def main():
    """Fonction principale"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Monitoring QuantumShield")
    parser.add_argument("--mode", choices=["check", "monitor", "report"], 
                       default="check", help="Mode d'exécution")
    parser.add_argument("--config", default="monitoring_config.json",
                       help="Fichier de configuration")
    
    args = parser.parse_args()
    
    monitor = QuantumShieldMonitor(args.config)
    
    if args.mode == "check":
        success = monitor.run_single_check()
        exit(0 if success else 1)
    elif args.mode == "monitor":
        monitor.run_monitoring_loop()
    elif args.mode == "report":
        monitor.generate_daily_report()

if __name__ == "__main__":
    main()