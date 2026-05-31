#!/bin/bash
echo "=== LCarDrive Security Audit ==="
echo ""

echo "1. Checking for exposed SECRET VALUES in client bundle..."
FOUND=0

# Check for actual secret value patterns (not just names)
if grep -r "sb_secret_" .next/static 2>/dev/null | grep -q .; then
  echo "   ❌ EXPOSED: Supabase service role VALUE found in bundle!"
  FOUND=1
else
  echo "   ✅ Safe: Supabase service role key not exposed"
fi

if grep -r "AIzaSy" .next/static 2>/dev/null | grep -q .; then
  echo "   ❌ EXPOSED: Gemini API key VALUE found in bundle!"
  FOUND=1
else
  echo "   ✅ Safe: Gemini API key not exposed"
fi

if grep -r "sk_test_" .next/static 2>/dev/null | grep -q .; then
  echo "   ❌ EXPOSED: Clerk SECRET key VALUE found in bundle!"
  FOUND=1
else
  echo "   ✅ Safe: Clerk secret key not exposed (false positive resolved)"
fi

if grep -r "re_" .next/static 2>/dev/null | grep -q "re_[A-Za-z0-9_-]\{20\}"; then
  echo "   ❌ EXPOSED: Resend API key VALUE found in bundle!"
  FOUND=1
else
  echo "   ✅ Safe: Resend API key not exposed"
fi

echo ""
echo "2. Checking environment variables..."
if [ -f ".env.local" ]; then
  echo "   ✅ .env.local exists"
  if grep -q "^NEXT_PUBLIC_SUPABASE_SERVICE" .env.local 2>/dev/null; then
    echo "   ❌ DANGER: Service role key is public!"
    FOUND=1
  else
    echo "   ✅ Service role key is private"
  fi
fi

echo ""
echo "3. Checking .gitignore..."
if grep -q ".env.local" .gitignore; then
  echo "   ✅ .env.local is gitignored"
else
  echo "   ❌ .env.local is NOT gitignored!"
  FOUND=1
fi

echo ""
if [ "$FOUND" -eq "0" ]; then
  echo "=== ✅ All checks passed — safe to deploy ==="
else
  echo "=== ❌ Fix issues before deploying ==="
fi
