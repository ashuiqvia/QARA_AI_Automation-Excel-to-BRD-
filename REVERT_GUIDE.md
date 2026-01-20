# Revert/Rollback Guide

This guide explains how to safely revert changes if something goes wrong after a merge.

## ⚠️ Important: Before Reverting

1. **Check the deployment status** - Is the issue actually caused by the latest deployment?
2. **Check logs** - Review application logs to identify the problem
3. **Test locally** - Reproduce the issue locally if possible
4. **Notify team** - Inform your team before reverting

## 🔄 Revert Methods

### Method 1: GitHub Web Interface (Easiest)

1. Go to your repository: `https://github.com/ashuiqvia/QARA_AI_Automation-Excel-to-BRD-`
2. Click on **"Commits"** tab
3. Find the commit you want to revert to
4. Click on the commit hash
5. Click **"Revert"** button
6. Review the changes
7. Create a pull request or commit directly

### Method 2: Using Git Commands

#### Quick Revert (Last Commit)
```bash
# Revert the last commit
git revert HEAD

# Push the revert
git push origin main
```

#### Revert to Specific Commit
```bash
# Find the commit hash you want to revert to
git log --oneline

# Revert all commits after a specific commit
git revert <commit-hash>..HEAD

# Or reset to a specific commit (⚠️ Use with caution)
git reset --hard <commit-hash>
git push --force-with-lease origin main
```

#### Revert Multiple Commits
```bash
# Revert commits from commit1 to commit2
git revert <commit1>^..<commit2>

# Push the revert
git push origin main
```

### Method 3: Using GitHub Actions Workflow

1. Go to **Actions** tab in GitHub
2. Select **"Revert Safety Check"** workflow
3. Click **"Run workflow"**
4. Enter the commit hash you want to revert to
5. Review the safety check results
6. Follow the suggested commands

## 🔍 Pre-Revert Checklist

Before reverting, check:

- [ ] **Database Changes**: Are there database migrations that need to be rolled back?
- [ ] **Environment Variables**: Do any new environment variables need to be removed?
- [ ] **Dependencies**: Are there new dependencies that might cause issues?
- [ ] **API Changes**: Are there breaking API changes?
- [ ] **Frontend Changes**: Are there frontend changes that depend on backend changes?

## 📋 Step-by-Step Revert Process

### Step 1: Identify the Problem
```bash
# Check recent commits
git log --oneline -10

# Check what changed in the problematic commit
git show <commit-hash>
```

### Step 2: Run Safety Check
```bash
# Use GitHub Actions workflow or manually check:
# - Database schema changes
# - Breaking API changes
# - Environment variable changes
```

### Step 3: Create Backup Branch (Recommended)
```bash
# Create a backup of current state
git checkout -b backup-before-revert-$(date +%Y%m%d)
git push origin backup-before-revert-$(date +%Y%m%d)

# Go back to main
git checkout main
```

### Step 4: Perform Revert
```bash
# Revert the problematic commit(s)
git revert <commit-hash>

# Or revert multiple commits
git revert <commit1> <commit2> <commit3>
```

### Step 5: Test Locally
```bash
# Test the reverted code locally
cd backend
python -m uvicorn main:app --reload

cd ../frontend/BRD_Builder
npm run dev
```

### Step 6: Push and Deploy
```bash
# Push the revert
git push origin main

# Deployment will happen automatically via Render/Vercel
```

### Step 7: Verify Deployment
- Check application health: `https://your-backend.onrender.com/health`
- Test critical functionality
- Monitor logs for errors

## 🗄️ Database Rollback

If database changes were made, you may need to rollback:

### Check Database Changes
```sql
-- Connect to your database
-- Check recent schema changes
SELECT * FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_NAME LIKE '%users%'
```

### Manual Database Rollback
```sql
-- Example: If a table was added, you might need to drop it
-- DROP TABLE IF EXISTS new_table_name;

-- If columns were added, you might need to remove them
-- ALTER TABLE users DROP COLUMN new_column;
```

## 🚨 Emergency Rollback

For critical production issues:

1. **Immediate**: Revert the latest commit via GitHub web interface
2. **Verify**: Check that deployment completes
3. **Monitor**: Watch application logs
4. **Document**: Record what went wrong and why

## 📝 Post-Revert Actions

After reverting:

1. **Document the issue** - Create an issue describing what went wrong
2. **Fix the problem** - Work on fixing the issue in a new branch
3. **Test thoroughly** - Test the fix before merging again
4. **Re-deploy** - Once fixed, merge and deploy again

## 🔐 Preventing Future Issues

To avoid needing reverts:

1. **Use Pull Requests** - Always use PRs for code review
2. **Run CI/CD checks** - Let GitHub Actions check before merging
3. **Test locally** - Always test changes locally first
4. **Staging environment** - Use a staging environment for testing
5. **Feature flags** - Use feature flags for gradual rollouts
6. **Database migrations** - Always test database changes carefully

## 📞 Support

If you need help with reverting:
- Check GitHub Actions logs
- Review deployment logs in Render/Vercel
- Consult the team before force-pushing

---

**Remember**: Reverting is a safety net, but prevention is better than cure!

