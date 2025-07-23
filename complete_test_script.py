#!/usr/bin/env python3
"""
Script complet de test et capture d'écran pour QuantumShield Web App
Génère une démonstration complète de toutes les fonctionnalités

Usage: python complete_test_script.py
"""

import asyncio
import os
import time
from datetime import datetime
from playwright.async_api import async_playwright

class QuantumShieldTester:
    def __init__(self):
        self.base_url = "http://localhost:3000"
        self.screenshots_dir = f"screenshots_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        self.page = None
        self.context = None
        self.browser = None
        
        # Test data
        self.test_user = {
            "username": "demo_user_full",
            "email": "demo@quantumshield.com",
            "password": "SecurePass123!"
        }
        
        self.test_device = {
            "device_id": "DEMO_SENSOR_001",
            "device_name": "Capteur Démonstration",
            "device_type": "Smart Sensor"
        }

    async def setup(self):
        """Initialize browser and create screenshots directory"""
        playwright = await async_playwright().start()
        self.browser = await playwright.chromium.launch(headless=False, slow_mo=1000)
        self.context = await self.browser.new_context(
            viewport={"width": 1920, "height": 1080},
            record_video_dir=f"videos_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        )
        self.page = await self.context.new_page()
        
        # Create screenshots directory
        os.makedirs(self.screenshots_dir, exist_ok=True)
        print(f"📁 Screenshots will be saved to: {self.screenshots_dir}")

    async def cleanup(self):
        """Close browser and cleanup"""
        if self.browser:
            await self.browser.close()

    async def screenshot(self, name: str, description: str = ""):
        """Take a screenshot with timestamp"""
        timestamp = datetime.now().strftime("%H%M%S")
        filename = f"{timestamp}_{name}.png"
        filepath = os.path.join(self.screenshots_dir, filename)
        
        await self.page.screenshot(path=filepath, full_page=True)
        print(f"📸 Screenshot: {filename} - {description}")
        await asyncio.sleep(2)  # Pause for video recording

    async def wait_and_screenshot(self, name: str, description: str = "", wait_time: int = 3):
        """Wait for elements to load and take screenshot"""
        await asyncio.sleep(wait_time)
        await self.screenshot(name, description)

    async def test_01_homepage(self):
        """Test 1: Page d'accueil"""
        print("\n🏠 TEST 1: Page d'accueil")
        
        await self.page.goto(self.base_url)
        await self.wait_and_screenshot("01_homepage", "Page d'accueil principale")
        
        # Test navigation in header
        await self.page.hover('a[href="/login"]')
        await self.screenshot("01_homepage_hover_login", "Survol du bouton Connexion")
        
        await self.page.hover('a[href="/register"]')
        await self.screenshot("01_homepage_hover_register", "Survol du bouton Inscription")

    async def test_02_registration(self):
        """Test 2: Inscription utilisateur"""
        print("\n📝 TEST 2: Inscription utilisateur")
        
        # Navigate to registration
        await self.page.click('a[href="/register"]')
        await self.wait_and_screenshot("02_register_page", "Page d'inscription")
        
        # Fill registration form step by step
        await self.page.fill('input[name="email"]', self.test_user["email"])
        await self.screenshot("02_register_email_filled", "Email rempli")
        
        await self.page.fill('input[name="username"]', self.test_user["username"])
        await self.screenshot("02_register_username_filled", "Nom d'utilisateur rempli")
        
        await self.page.fill('input[name="password"]', self.test_user["password"])
        await self.screenshot("02_register_password_filled", "Mot de passe rempli")
        
        await self.page.fill('input[name="confirmPassword"]', self.test_user["password"])
        await self.screenshot("02_register_confirm_filled", "Confirmation mot de passe remplie")
        
        # Submit registration
        await self.page.click('button[type="submit"]')
        await self.wait_and_screenshot("02_register_submitted", "Inscription soumise", 5)

    async def test_03_login(self):
        """Test 3: Connexion utilisateur"""
        print("\n🔐 TEST 3: Connexion utilisateur")
        
        # Should be redirected to login or already on login
        current_url = self.page.url
        if 'login' not in current_url:
            await self.page.goto(f"{self.base_url}/login")
            
        await self.wait_and_screenshot("03_login_page", "Page de connexion")
        
        # Login process
        await self.page.fill('input[name="username"]', self.test_user["username"])
        await self.screenshot("03_login_username_filled", "Nom d'utilisateur saisi")
        
        await self.page.fill('input[name="password"]', self.test_user["password"])
        await self.screenshot("03_login_password_filled", "Mot de passe saisi")
        
        await self.page.click('button[type="submit"]')
        await self.wait_and_screenshot("03_login_submitted", "Connexion réussie", 5)

    async def test_04_dashboard(self):
        """Test 4: Dashboard principal"""
        print("\n📊 TEST 4: Dashboard principal")
        
        # Navigate to dashboard if not already there
        await self.page.goto(f"{self.base_url}/dashboard")
        await self.wait_and_screenshot("04_dashboard_main", "Dashboard principal avec statistiques")
        
        # Test dashboard sections
        await self.page.hover('.bg-white:has-text("55.00")')  # QS Balance card
        await self.screenshot("04_dashboard_balance_hover", "Survol carte solde QS")
        
        await self.page.hover('.bg-white:has-text("Mes Dispositifs")')
        await self.screenshot("04_dashboard_devices_hover", "Survol carte dispositifs")
        
        # Scroll to see more content
        await self.page.evaluate("window.scrollTo(0, document.body.scrollHeight/2)")
        await self.screenshot("04_dashboard_scrolled", "Dashboard avec activité récente")

    async def test_05_devices_page(self):
        """Test 5: Gestion des dispositifs IoT"""
        print("\n🔌 TEST 5: Gestion des dispositifs IoT")
        
        # Navigate to devices page
        await self.page.click('a[href="/devices"]')
        await self.wait_and_screenshot("05_devices_empty", "Page dispositifs (vide)")
        
        # Add new device
        await self.page.click('button:has-text("Ajouter un dispositif")')
        await self.wait_and_screenshot("05_devices_add_modal", "Modal d'ajout de dispositif")
        
        # Fill device form
        await self.page.fill('input[placeholder*="SENSOR"]', self.test_device["device_id"])
        await self.screenshot("05_devices_id_filled", "ID dispositif rempli")
        
        await self.page.fill('input[placeholder*="Capteur"]', self.test_device["device_name"])
        await self.screenshot("05_devices_name_filled", "Nom dispositif rempli")
        
        await self.page.select_option('select', self.test_device["device_type"])
        await self.screenshot("05_devices_type_selected", "Type dispositif sélectionné")
        
        # Submit device
        await self.page.click('button[type="submit"]:has-text("Ajouter")')
        await self.wait_and_screenshot("05_devices_added", "Dispositif ajouté avec succès", 5)
        
        # Test device actions
        await self.page.click('button:has-text("Heartbeat")')
        await self.wait_and_screenshot("05_devices_heartbeat", "Heartbeat envoyé", 3)
        
        await self.page.click('button:has-text("Détails")')
        await self.wait_and_screenshot("05_devices_details_modal", "Modal détails dispositif", 2)
        
        # Close modal
        await self.page.click('button:has-text("✕")')
        await asyncio.sleep(1)
        
        # Test status changes
        await self.page.click('button:has-text("Désactiver")')
        await self.wait_and_screenshot("05_devices_deactivated", "Dispositif désactivé", 3)
        
        await self.page.click('button:has-text("Maintenance")')
        await self.wait_and_screenshot("05_devices_maintenance", "Dispositif en maintenance", 3)
        
        await self.page.click('button:has-text("Activer")')
        await self.wait_and_screenshot("05_devices_activated", "Dispositif réactivé", 3)

    async def test_06_crypto_page(self):
        """Test 6: Cryptographie NTRU++"""
        print("\n🔐 TEST 6: Cryptographie NTRU++")
        
        # Navigate to crypto page
        await self.page.click('a[href="/crypto"]')
        await self.wait_and_screenshot("06_crypto_main", "Page cryptographie principale")
        
        # Generate keys
        await self.page.click('button:has-text("Générer")')
        await self.wait_and_screenshot("06_crypto_keys_generated", "Clés NTRU++ générées", 5)
        
        # Test encryption
        await self.page.click('[role="tab"]:has-text("Chiffrement")')
        await self.screenshot("06_crypto_encryption_tab", "Onglet chiffrement")
        
        await self.page.fill('textarea[placeholder*="message"]', "Message secret de test pour QuantumShield!")
        await self.screenshot("06_crypto_message_entered", "Message à chiffrer saisi")
        
        await self.page.click('button:has-text("Chiffrer")')
        await self.wait_and_screenshot("06_crypto_encrypted", "Message chiffré", 3)
        
        # Test decryption
        await self.page.click('[role="tab"]:has-text("Déchiffrement")')
        await self.screenshot("06_crypto_decryption_tab", "Onglet déchiffrement")
        
        await self.page.click('button:has-text("Déchiffrer")')
        await self.wait_and_screenshot("06_crypto_decrypted", "Message déchiffré", 3)
        
        # Test signatures
        await self.page.click('[role="tab"]:has-text("Signature")')
        await self.screenshot("06_crypto_signature_tab", "Onglet signature")
        
        await self.page.fill('textarea[placeholder*="signer"]', "Document important à signer")
        await self.page.click('button:has-text("Signer")')
        await self.wait_and_screenshot("06_crypto_signed", "Document signé", 3)
        
        # Test verification
        await self.page.click('[role="tab"]:has-text("Vérification")')
        await self.screenshot("06_crypto_verification_tab", "Onglet vérification")
        
        await self.page.click('button:has-text("Vérifier")')
        await self.wait_and_screenshot("06_crypto_verified", "Signature vérifiée", 3)

    async def test_07_tokens_page(self):
        """Test 7: Système de tokens QS"""
        print("\n🪙 TEST 7: Système de tokens QS")
        
        # Navigate to tokens page
        await self.page.click('a[href="/tokens"]')
        await self.wait_and_screenshot("07_tokens_main", "Page tokens QS principale")
        
        # Test different sections
        await self.page.click('[role="tab"]:has-text("Transactions")')
        await self.screenshot("07_tokens_transactions", "Historique des transactions")
        
        await self.page.click('[role="tab"]:has-text("Récompenses")')
        await self.screenshot("07_tokens_rewards", "Système de récompenses")
        
        await self.page.click('[role="tab"]:has-text("Marché")')
        await self.screenshot("07_tokens_market", "Informations marché")
        
        # Test reward claiming if available
        claim_button = await self.page.is_visible('button:has-text("Réclamer")')
        if claim_button:
            await self.page.click('button:has-text("Réclamer")')
            await self.wait_and_screenshot("07_tokens_claimed", "Récompense réclamée", 3)

    async def test_08_navigation_and_user_menu(self):
        """Test 8: Navigation et menu utilisateur"""
        print("\n🧭 TEST 8: Navigation et menu utilisateur")
        
        # Test user balance display in header
        await self.page.hover('span:has-text("QS")')
        await self.screenshot("08_nav_balance_hover", "Survol solde utilisateur")
        
        # Test username display
        await self.page.hover(f'text={self.test_user["username"]}')
        await self.screenshot("08_nav_username_hover", "Survol nom utilisateur")
        
        # Navigate through all pages via menu
        pages = [
            ("Dashboard", "/dashboard"),
            ("Dispositifs", "/devices"),
            ("Cryptographie", "/crypto"),
            ("Tokens QS", "/tokens")
        ]
        
        for page_name, url in pages:
            await self.page.click(f'a[href="{url}"]')
            await self.wait_and_screenshot(f"08_nav_to_{page_name.lower()}", f"Navigation vers {page_name}")
        
        # Test responsive design (mobile view)
        await self.page.set_viewport_size({"width": 375, "height": 667})
        await self.screenshot("08_mobile_view", "Vue mobile responsive")
        
        # Reset to desktop view
        await self.page.set_viewport_size({"width": 1920, "height": 1080})

    async def test_09_logout(self):
        """Test 9: Déconnexion"""
        print("\n🚪 TEST 9: Déconnexion")
        
        # Logout
        await self.page.click('button:has-text("Déconnexion")')
        await self.wait_and_screenshot("09_logout_process", "Processus de déconnexion", 3)
        
        # Should redirect to homepage
        await self.wait_and_screenshot("09_logout_homepage", "Retour à la page d'accueil après déconnexion")

    async def test_10_final_overview(self):
        """Test 10: Vue d'ensemble finale"""
        print("\n🎯 TEST 10: Vue d'ensemble finale")
        
        # Take final screenshots of key pages
        await self.page.goto(self.base_url)
        await self.screenshot("10_final_homepage", "Page d'accueil finale")
        
        await self.page.goto(f"{self.base_url}/login")
        await self.screenshot("10_final_login", "Page de connexion finale")
        
        await self.page.goto(f"{self.base_url}/register")
        await self.screenshot("10_final_register", "Page d'inscription finale")

    async def run_complete_test(self):
        """Execute complete test suite"""
        print("🚀 Démarrage du test complet de QuantumShield Web App")
        print("=" * 60)
        
        try:
            await self.setup()
            
            # Execute all tests in sequence
            await self.test_01_homepage()
            await self.test_02_registration()
            await self.test_03_login()
            await self.test_04_dashboard()
            await self.test_05_devices_page()
            await self.test_06_crypto_page()
            await self.test_07_tokens_page()
            await self.test_08_navigation_and_user_menu()
            await self.test_09_logout()
            await self.test_10_final_overview()
            
            print("\n" + "=" * 60)
            print("✅ TEST COMPLET TERMINÉ AVEC SUCCÈS!")
            print(f"📁 Screenshots sauvegardées dans: {self.screenshots_dir}")
            print(f"🎥 Vidéo disponible dans: videos_{datetime.now().strftime('%Y%m%d_%H%M%S')}")
            
        except Exception as e:
            print(f"\n❌ ERREUR PENDANT LES TESTS: {e}")
            await self.screenshot("error_state", f"État d'erreur: {e}")
            
        finally:
            await self.cleanup()

async def main():
    """Main execution function"""
    tester = QuantumShieldTester()
    await tester.run_complete_test()

if __name__ == "__main__":
    asyncio.run(main())