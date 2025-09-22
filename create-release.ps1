# PowerShell script to create a new release
# Usage: .\create-release.ps1 -Version "1.0.1" -Message "Bug fixes and improvements"

param(
    [Parameter(Mandatory=$true)]
    [string]$Version,
    
    [Parameter(Mandatory=$true)]
    [string]$Message
)

# Validate version format
if ($Version -notmatch '^v?\d+\.\d+\.\d+$') {
    Write-Error "Version must be in format 'x.y.z' or 'vx.y.z'"
    exit 1
}

# Ensure version starts with 'v'
if (-not $Version.StartsWith('v')) {
    $Version = "v$Version"
}

Write-Host "Creating release $Version..." -ForegroundColor Green

try {
    # Add all changes
    Write-Host "Adding changes..." -ForegroundColor Yellow
    git add .
    
    # Commit changes
    Write-Host "Committing changes..." -ForegroundColor Yellow
    git commit -m $Message
    
    # Create and push tag
    Write-Host "Creating tag $Version..." -ForegroundColor Yellow
    git tag -a $Version -m "Release $Version: $Message"
    
    # Push changes and tags
    Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
    git push origin main
    git push origin $Version
    
    Write-Host "✅ Release $Version created successfully!" -ForegroundColor Green
    Write-Host "🚀 GitHub Actions will automatically create the release page." -ForegroundColor Cyan
    Write-Host "📋 Check: https://github.com/DinamohammadFe/New-Adam-Hospital/releases" -ForegroundColor Cyan
    
} catch {
    Write-Error "Failed to create release: $_"
    exit 1
}