# QuantumShield Document Conversion Script
# Convertit automatiquement les fichiers Markdown en PDF et PowerPoint

Write-Host "🛡️ QuantumShield - Document Conversion Script" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

# Configuration
$UtilsPath = "/app/Utils"
$OutputPath = "/app/Utils/Generated"

# Créer dossier de sortie si n'existe pas
if (!(Test-Path $OutputPath)) {
    New-Item -ItemType Directory -Path $OutputPath
    Write-Host "📁 Dossier de sortie créé : $OutputPath" -ForegroundColor Green
}

# Vérifier si Pandoc est installé
Write-Host "🔍 Vérification de Pandoc..." -ForegroundColor Yellow
try {
    $pandocVersion = pandoc --version
    Write-Host "✅ Pandoc trouvé : $($pandocVersion[0])" -ForegroundColor Green
} catch {
    Write-Host "❌ Pandoc non trouvé. Installation requise :" -ForegroundColor Red
    Write-Host "   Windows: choco install pandoc" -ForegroundColor Red
    Write-Host "   macOS: brew install pandoc" -ForegroundColor Red
    Write-Host "   Linux: sudo apt-get install pandoc" -ForegroundColor Red
    exit 1
}

# Fonction pour convertir Markdown vers PDF
function Convert-ToPDF {
    param(
        [string]$InputFile,
        [string]$OutputFile,
        [string]$Title
    )
    
    Write-Host "📄 Conversion PDF : $Title" -ForegroundColor Yellow
    
    try {
        # Commande Pandoc avec options pour meilleur rendu
        $pandocArgs = @(
            $InputFile,
            "-o", $OutputFile,
            "--pdf-engine=wkhtmltopdf",
            "--margin-top=20mm",
            "--margin-bottom=20mm", 
            "--margin-left=20mm",
            "--margin-right=20mm",
            "--enable-local-file-access"
        )
        
        & pandoc @pandocArgs
        
        if (Test-Path $OutputFile) {
            Write-Host "✅ PDF créé : $OutputFile" -ForegroundColor Green
        } else {
            Write-Host "❌ Échec création PDF" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ Erreur Pandoc : $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Fonction pour créer le template PowerPoint
function Create-PowerPointTemplate {
    Write-Host "📊 Création template PowerPoint..." -ForegroundColor Yellow
    
    # Template PowerPoint VBA script
    $vbaScript = @"
Sub CreateQuantumShieldTemplate()
    ' Créer nouvelle présentation
    Dim ppt As Presentation
    Set ppt = Presentations.Add
    
    ' Configuration couleurs QuantumShield
    With ppt.SlideMaster.ColorScheme
        .Colors(ppAccent1).RGB = RGB(2, 132, 199)  ' Bleu principal #0284C7
        .Colors(ppAccent2).RGB = RGB(224, 242, 254) ' Bleu clair #E0F2FE
        .Colors(ppAccent3).RGB = RGB(16, 185, 129)  ' Vert #10B981
        .Colors(ppBackground).RGB = RGB(255, 255, 255) ' Blanc
        .Colors(ppForeground).RGB = RGB(31, 41, 55)    ' Gris foncé
    End With
    
    ' Définir police par défaut
    With ppt.SlideMaster.TextStyles(ppTitleText).Levels(1).Font
        .Name = "Calibri"
        .Size = 36
        .Bold = True
    End With
    
    ' Sauvegarder template
    ppt.SaveAs "QuantumShield_Template.potx", ppSaveAsOpenXMLTemplate
    
    MsgBox "Template QuantumShield créé avec succès!"
End Sub
"@
    
    # Écrire le script VBA dans un fichier
    $vbaPath = "$OutputPath/CreateTemplate.vba"
    $vbaScript | Out-File -FilePath $vbaPath -Encoding UTF8
    
    Write-Host "📝 Script VBA créé : $vbaPath" -ForegroundColor Green
    Write-Host "   Instructions :" -ForegroundColor Cyan
    Write-Host "   1. Ouvrir PowerPoint" -ForegroundColor Cyan
    Write-Host "   2. Alt+F11 pour ouvrir éditeur VBA" -ForegroundColor Cyan
    Write-Host "   3. Coller le contenu du fichier .vba" -ForegroundColor Cyan
    Write-Host "   4. Exécuter la macro CreateQuantumShieldTemplate" -ForegroundColor Cyan
}

# Conversion Documentation PDF
Write-Host "`n📋 CONVERSION DOCUMENTATION COMPLÈTE" -ForegroundColor Magenta
Convert-ToPDF -InputFile "$UtilsPath/FUNDING_DOCUMENTATION.md" -OutputFile "$OutputPath/QuantumShield_Funding_Documentation.pdf" -Title "Documentation Financement"

# Conversion Pitch Deck PDF  
Write-Host "`n🎯 CONVERSION PITCH DECK PDF" -ForegroundColor Magenta
Convert-ToPDF -InputFile "$UtilsPath/PITCH_DECK_CONTENT.md" -OutputFile "$OutputPath/QuantumShield_PitchDeck.pdf" -Title "Pitch Deck"

# Création template PowerPoint
Write-Host "`n🎨 TEMPLATE POWERPOINT" -ForegroundColor Magenta
Create-PowerPointTemplate

# Création d'un fichier HTML stylé pour prévisualisation
Write-Host "`n🌐 GÉNÉRATION PRÉVISUALISATION HTML" -ForegroundColor Magenta

$htmlStyle = @"
<style>
    body { 
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
        line-height: 1.6; 
        color: #1F2937; 
        max-width: 900px; 
        margin: 0 auto; 
        padding: 20px; 
    }
    h1 { color: #0284C7; border-bottom: 3px solid #0284C7; }
    h2 { color: #0369A1; margin-top: 2em; }
    h3 { color: #0284C7; }
    .slide { 
        border: 2px solid #E0F2FE; 
        margin: 20px 0; 
        padding: 20px; 
        border-radius: 8px; 
        background: #F8FAFC;
    }
    .highlight { background: #E0F2FE; padding: 2px 6px; border-radius: 4px; }
    table { border-collapse: collapse; width: 100%; margin: 1em 0; }
    th, td { border: 1px solid #E5E7EB; padding: 8px 12px; text-align: left; }
    th { background: #0284C7; color: white; }
    code { background: #F3F4F6; padding: 2px 4px; border-radius: 3px; }
</style>
"@

# Convertir Pitch Deck en HTML stylé
try {
    pandoc "$UtilsPath/PITCH_DECK_CONTENT.md" -o "$OutputPath/QuantumShield_PitchDeck_Preview.html" --standalone --css=<(echo $htmlStyle)
    Write-Host "✅ Prévisualisation HTML créée" -ForegroundColor Green
} catch {
    Write-Host "⚠️ HTML optionnel non créé" -ForegroundColor Yellow
}

# Résumé final
Write-Host "`n🎉 CONVERSION TERMINÉE !" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host "📁 Fichiers générés dans : $OutputPath" -ForegroundColor Cyan

if (Test-Path "$OutputPath/QuantumShield_Funding_Documentation.pdf") {
    Write-Host "✅ Documentation PDF : QuantumShield_Funding_Documentation.pdf" -ForegroundColor Green
}

if (Test-Path "$OutputPath/QuantumShield_PitchDeck.pdf") {
    Write-Host "✅ Pitch Deck PDF : QuantumShield_PitchDeck.pdf" -ForegroundColor Green
}

Write-Host "📝 Template VBA : CreateTemplate.vba" -ForegroundColor Green
Write-Host "🌐 Prévisualisation : QuantumShield_PitchDeck_Preview.html" -ForegroundColor Green

Write-Host "`n📋 PROCHAINES ÉTAPES :" -ForegroundColor Yellow
Write-Host "1. Vérifier les PDFs générés" -ForegroundColor White
Write-Host "2. Utiliser le script VBA pour créer template PowerPoint" -ForegroundColor White  
Write-Host "3. Copier contenu pitch deck slide par slide dans PowerPoint" -ForegroundColor White
Write-Host "4. Ajouter éléments visuels (graphiques, images, logos)" -ForegroundColor White
Write-Host "5. Tester présentation avant utilisation" -ForegroundColor White

Write-Host "`n🔗 RESSOURCES UTILES :" -ForegroundColor Yellow
Write-Host "• Templates PowerPoint : GraphicRiver, SlideModel" -ForegroundColor White
Write-Host "• Conversion online : md-to-pdf.fly.dev" -ForegroundColor White
Write-Host "• Design assistance : Fiverr, Upwork" -ForegroundColor White

# Ouvrir dossier de sortie
try {
    if ($IsWindows) {
        Start-Process "explorer.exe" $OutputPath
    } elseif ($IsMacOS) {  
        Start-Process "open" $OutputPath
    } else {
        Start-Process "xdg-open" $OutputPath
    }
    Write-Host "📁 Dossier ouvert automatiquement" -ForegroundColor Green
} catch {
    Write-Host "📁 Ouvrir manuellement : $OutputPath" -ForegroundColor Yellow
}

Write-Host "`n🛡️ QuantumShield - Documents prêts pour investors !" -ForegroundColor Cyan