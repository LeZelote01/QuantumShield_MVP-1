#!/usr/bin/env python3
"""
🧪 Script de test de déploiement QuantumShield
Teste automatiquement tous les services déployés
"""

import requests
import time
import json
import sys
from datetime import datetime

class DeploymentTester:
    def __init__(self):
        # URLs à configurer après déploiement
        self.backend_url = input("🔗 URL de votre backend Railway (ex: https://your-app.railway.app): ").strip()
        self.frontend_url = input("🔗 URL de votre frontend Vercel (ex: https://your-app.vercel.app): ").strip()
        
        self.test_results = []
        
    def log_result(self, test_name: str, success: bool, message: str = ""):
        """Log les résultats des tests"""
        status = "✅" if success else "❌"
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        print(f"{status} {test_name}: {message}")

    def test_backend_health(self):
        """Test de santé du backend"""
        try:
            response = requests.get(f"{self.backend_url}/api/health", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "healthy":
                    self.log_result("Backend Health", True, f"Status: {data.get('status')}")
                    return True
                else:
                    self.log_result("Backend Health", False, f"Unhealthy status: {data}")
                    return False
            else:
                self.log_result("Backend Health", False, f"HTTP {response.status_code}")
                return False
        except Exception as e:
            self.log_result("Backend Health", False, f"Connection error: {e}")
            return False

    def test_backend_cors(self):
        """Test de la configuration CORS"""
        try:
            headers = {
                'Origin': self.frontend_url,
                'Content-Type': 'application/json'
            }
            response = requests.get(f"{self.backend_url}/api/health", headers=headers, timeout=10)
            
            if response.status_code == 200:
                # Vérifier les headers CORS
                cors_header = response.headers.get('Access-Control-Allow-Origin')
                if cors_header and (cors_header == '*' or self.frontend_url in cors_header):
                    self.log_result("CORS Configuration", True, "CORS headers correct")
                    return True
                else:
                    self.log_result("CORS Configuration", False, f"CORS header: {cors_header}")
                    return False
            else:
                self.log_result("CORS Configuration", False, f"HTTP {response.status_code}")
                return False
        except Exception as e:
            self.log_result("CORS Configuration", False, f"Error: {e}")
            return False

    def test_user_registration(self):
        """Test d'inscription utilisateur"""
        try:
            test_user = {
                "email": f"test_{int(time.time())}@deployment.test",
                "username": f"test_user_{int(time.time())}",
                "password": "TestPass123!"
            }
            
            response = requests.post(
                f"{self.backend_url}/api/auth/register",
                json=test_user,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if "user" in data:
                    self.log_result("User Registration", True, f"User created: {data['user']['username']}")
                    return test_user
                else:
                    self.log_result("User Registration", False, f"Invalid response: {data}")
                    return None
            else:
                self.log_result("User Registration", False, f"HTTP {response.status_code}: {response.text}")
                return None
        except Exception as e:
            self.log_result("User Registration", False, f"Error: {e}")
            return None

    def test_user_login(self, user_data):
        """Test de connexion utilisateur"""
        if not user_data:
            self.log_result("User Login", False, "No user data provided")
            return None
            
        try:
            login_data = {
                "username": user_data["username"],
                "password": user_data["password"]
            }
            
            response = requests.post(
                f"{self.backend_url}/api/auth/login",
                json=login_data,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if "access_token" in data:
                    self.log_result("User Login", True, "Authentication successful")
                    return data["access_token"]
                else:
                    self.log_result("User Login", False, f"No token in response: {data}")
                    return None
            else:
                self.log_result("User Login", False, f"HTTP {response.status_code}: {response.text}")
                return None
        except Exception as e:
            self.log_result("User Login", False, f"Error: {e}")
            return None

    def test_protected_endpoints(self, token):
        """Test des endpoints protégés"""
        if not token:
            self.log_result("Protected Endpoints", False, "No auth token")
            return False
            
        try:
            headers = {"Authorization": f"Bearer {token}"}
            
            # Test dashboard endpoint
            response = requests.get(
                f"{self.backend_url}/api/dashboard/",
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                self.log_result("Protected Endpoints", True, "Dashboard accessible")
                return True
            else:
                self.log_result("Protected Endpoints", False, f"HTTP {response.status_code}")
                return False
        except Exception as e:
            self.log_result("Protected Endpoints", False, f"Error: {e}")
            return False

    def test_frontend_accessibility(self):
        """Test d'accessibilité du frontend"""
        try:
            response = requests.get(self.frontend_url, timeout=10)
            if response.status_code == 200:
                # Vérifier que c'est bien une page HTML React
                if "react" in response.text.lower() or "quantumshield" in response.text.lower():
                    self.log_result("Frontend Accessibility", True, "Frontend loaded successfully")
                    return True
                else:
                    self.log_result("Frontend Accessibility", False, "Not a valid React app")
                    return False
            else:
                self.log_result("Frontend Accessibility", False, f"HTTP {response.status_code}")
                return False
        except Exception as e:
            self.log_result("Frontend Accessibility", False, f"Error: {e}")
            return False

    def test_api_endpoints(self, token):
        """Test des principaux endpoints API"""
        if not token:
            return False
            
        headers = {"Authorization": f"Bearer {token}"}
        endpoints = [
            ("/api/devices/types/supported", "Device Types"),
            ("/api/tokens/balance", "Token Balance"),
            ("/api/crypto/performance", "Crypto Performance")
        ]
        
        success_count = 0
        for endpoint, name in endpoints:
            try:
                response = requests.get(f"{self.backend_url}{endpoint}", headers=headers, timeout=10)
                if response.status_code == 200:
                    self.log_result(f"API {name}", True, "Endpoint accessible")
                    success_count += 1
                else:
                    self.log_result(f"API {name}", False, f"HTTP {response.status_code}")
            except Exception as e:
                self.log_result(f"API {name}", False, f"Error: {e}")
        
        return success_count == len(endpoints)

    def generate_report(self):
        """Génère un rapport de test"""
        total_tests = len(self.test_results)
        successful_tests = sum(1 for r in self.test_results if r["success"])
        
        print("\n" + "="*60)
        print("📊 RAPPORT DE TEST DE DÉPLOIEMENT")
        print("="*60)
        print(f"Total des tests: {total_tests}")
        print(f"Tests réussis: {successful_tests}")
        print(f"Tests échoués: {total_tests - successful_tests}")
        print(f"Taux de réussite: {(successful_tests/total_tests)*100:.1f}%")
        
        if successful_tests == total_tests:
            print("\n🎉 DÉPLOIEMENT RÉUSSI ! Toutes les fonctionnalités sont opérationnelles.")
        else:
            print("\n⚠️  DÉPLOIEMENT PARTIEL - Certains tests ont échoué:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"   ❌ {result['test']}: {result['message']}")
        
        # Sauvegarder le rapport
        with open(f"deployment_test_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json", "w") as f:
            json.dump(self.test_results, f, indent=2)
        
        return successful_tests == total_tests

    def run_all_tests(self):
        """Exécute tous les tests"""
        print("🧪 Démarrage des tests de déploiement QuantumShield")
        print("="*60)
        
        # Test 1: Backend Health
        if not self.test_backend_health():
            print("❌ Backend inaccessible - Arrêt des tests")
            return self.generate_report()
        
        # Test 2: CORS Configuration
        self.test_backend_cors()
        
        # Test 3: Frontend Accessibility
        self.test_frontend_accessibility()
        
        # Test 4: User Registration
        user_data = self.test_user_registration()
        
        # Test 5: User Login
        token = self.test_user_login(user_data)
        
        # Test 6: Protected Endpoints
        self.test_protected_endpoints(token)
        
        # Test 7: API Endpoints
        self.test_api_endpoints(token)
        
        return self.generate_report()

def main():
    """Fonction principale"""
    print("🚀 Testeur de Déploiement QuantumShield")
    print("=====================================")
    
    tester = DeploymentTester()
    success = tester.run_all_tests()
    
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()