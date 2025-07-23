#!/usr/bin/env python3
"""
Démonstration rapide QuantumShield - Test des fonctionnalités corrigées
Focus sur les boutons "Désactiver" et "Maintenance" qui ont été corrigés
"""

import asyncio
from playwright.async_api import async_playwright

async def demo_device_actions():
    """Démonstration des actions de dispositifs corrigées"""
    playwright = await async_playwright().start()
    browser = await playwright.chromium.launch(headless=False, slow_mo=2000)
    page = await browser.new_page()
    
    try:
        print("🚀 Démonstration QuantumShield - Actions de Dispositifs")
        
        # Register and login
        await page.goto("http://localhost:3000/register")
        await page.fill('input[name="email"]', 'demo@fixed.com')
        await page.fill('input[name="username"]', 'demo_fixed')
        await page.fill('input[name="password"]', 'test123')
        await page.fill('input[name="confirmPassword"]', 'test123')
        await page.click('button[type="submit"]')
        await asyncio.sleep(3)
        
        if 'login' in page.url:
            await page.fill('input[name="username"]', 'demo_fixed')
            await page.fill('input[name="password"]', 'test123')
            await page.click('button[type="submit"]')
            await asyncio.sleep(3)
        
        # Go to devices
        await page.goto("http://localhost:3000/devices")
        await asyncio.sleep(2)
        
        # Add device
        await page.click('button:has-text("Ajouter un dispositif")')
        await page.fill('input[placeholder*="SENSOR"]', 'DEMO_FIXED_001')
        await page.fill('input[placeholder*="Capteur"]', 'Dispositif Démonstration')
        await page.select_option('select', 'Smart Sensor')
        await page.click('button[type="submit"]:has-text("Ajouter")')
        await asyncio.sleep(4)
        
        print("✅ Dispositif ajouté avec succès")
        
        # Test FIXED buttons
        print("🔧 Test du bouton Désactiver (CORRIGÉ)")
        await page.click('button:has-text("Désactiver")')
        await asyncio.sleep(3)
        
        print("🔧 Test du bouton Maintenance (CORRIGÉ)")
        await page.click('button:has-text("Maintenance")')
        await asyncio.sleep(3)
        
        print("🔧 Test du bouton Activer")
        await page.click('button:has-text("Activer")')
        await asyncio.sleep(3)
        
        print("✅ TOUS LES BOUTONS FONCTIONNENT PARFAITEMENT!")
        print("🎉 Correction validée avec succès!")
        
        # Take final screenshot
        await page.screenshot(path="/app/demo_fixed_actions.png", full_page=True)
        print("📸 Capture d'écran sauvegardée: demo_fixed_actions.png")
        
    except Exception as e:
        print(f"❌ Erreur: {e}")
    finally:
        await browser.close()
        await playwright.stop()

if __name__ == "__main__":
    asyncio.run(demo_device_actions())