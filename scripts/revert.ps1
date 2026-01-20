# PowerShell script to safely revert to a previous commit
# Usage: .\scripts\revert.ps1 -CommitHash "abc123"

param(
    [Parameter(Mandatory=$true)]
    [string]$CommitHash,
    
    [switch]$Force,
    [switch]$DryRun
)

Write-Host "🔄 Revert Script" -ForegroundColor Cyan
Write-Host "=================" -ForegroundColor Cyan
Write-Host ""

# Check if commit exists
Write-Host "Checking commit: $CommitHash" -ForegroundColor Yellow
$commitExists = git cat-file -e $CommitHash 2>$null

if (-not $commitExists) {
    Write-Host "❌ ERROR: Commit $CommitHash not found!" -ForegroundColor Red
    exit 1
}

# Show commit details
Write-Host "📋 Commit Details:" -ForegroundColor Green
git log -1 --format="Hash: %H`nAuthor: %an <%ae>`nDate: %ad`nMessage: %s`n" $CommitHash
Write-Host ""

# Check current branch
$currentBranch = git branch --show-current
Write-Host "Current branch: $currentBranch" -ForegroundColor Yellow

if ($currentBranch -ne "main" -and -not $Force) {
    Write-Host "⚠️  WARNING: You're not on main branch!" -ForegroundColor Yellow
    $confirm = Read-Host "Continue anyway? (y/N)"
    if ($confirm -ne "y") {
        Write-Host "Aborted." -ForegroundColor Red
        exit 1
    }
}

# Show what will be reverted
Write-Host "`n📁 Files that will be changed:" -ForegroundColor Green
git diff --name-status $CommitHash HEAD | Select-Object -First 10
Write-Host ""

# Dry run mode
if ($DryRun) {
    Write-Host "🔍 DRY RUN MODE - No changes will be made" -ForegroundColor Cyan
    Write-Host "To actually revert, run without -DryRun flag" -ForegroundColor Yellow
    exit 0
}

# Confirm before reverting
Write-Host "⚠️  WARNING: This will revert commits after $CommitHash" -ForegroundColor Yellow
$confirm = Read-Host "Are you sure you want to continue? (yes/no)"
if ($confirm -ne "yes") {
    Write-Host "Aborted." -ForegroundColor Red
    exit 1
}

# Create backup branch
$backupBranch = "backup-before-revert-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
Write-Host "`n📦 Creating backup branch: $backupBranch" -ForegroundColor Cyan
git branch $backupBranch
Write-Host "✓ Backup created" -ForegroundColor Green

# Perform revert
Write-Host "`n🔄 Reverting to commit: $CommitHash" -ForegroundColor Cyan
try {
    git revert --no-commit $CommitHash..HEAD
    Write-Host "✓ Revert prepared" -ForegroundColor Green
    
    Write-Host "`n📝 Review changes:" -ForegroundColor Yellow
    git status
    
    $push = Read-Host "`nPush to remote? (y/N)"
    if ($push -eq "y") {
        git commit -m "Revert to commit $CommitHash"
        git push origin $currentBranch
        Write-Host "✓ Revert pushed to remote" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Revert committed locally but NOT pushed" -ForegroundColor Yellow
        Write-Host "   Review with: git log" -ForegroundColor Yellow
        Write-Host "   Push later with: git push origin $currentBranch" -ForegroundColor Yellow
    }
    
    Write-Host "`n✅ Revert completed successfully!" -ForegroundColor Green
    Write-Host "   Backup branch: $backupBranch" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ ERROR during revert: $_" -ForegroundColor Red
    Write-Host "   Restore from backup: git checkout $backupBranch" -ForegroundColor Yellow
    exit 1
}

