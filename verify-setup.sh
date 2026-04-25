#!/bin/bash

# Future Foods Setup Verification Script
# Run this to verify all dependencies are installed and configured

echo "======================================"
echo "🔍 Future Foods Setup Verification"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter for checks
checks_passed=0
checks_total=0

# Helper function
check_item() {
  local item=$1
  local command=$2
  checks_total=$((checks_total + 1))
  
  if eval "$command" > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} $item"
    checks_passed=$((checks_passed + 1))
  else
    echo -e "${RED}✗${NC} $item"
  fi
}

# Check Node and npm
echo "📦 Checking Node Environment..."
check_item "Node.js installed" "node --version"
check_item "npm installed" "npm --version"
echo ""

# Check required npm packages
echo "📚 Checking npm Packages..."
check_item "@stripe/react-stripe-js" "npm ls @stripe/react-stripe-js"
check_item "@stripe/stripe-js" "npm ls @stripe/stripe-js"
check_item "react-router-dom" "npm ls react-router-dom"
check_item "@tanstack/react-query" "npm ls @tanstack/react-query"
echo ""

# Check files exist
echo "📁 Checking Required Files..."
check_item ".env.local exists" "test -f .env.local"
check_item "src/services/apiService.ts" "test -f src/services/apiService.ts"
check_item "src/services/stripeService.ts" "test -f src/services/stripeService.ts"
check_item "src/providers/StripeProvider.tsx" "test -f src/providers/StripeProvider.tsx"
check_item "src/components/PaymentForm.tsx" "test -f src/components/PaymentForm.tsx"
check_item "src/components/Checkout.tsx" "test -f src/components/Checkout.tsx"
check_item "src/hooks/useCart.ts" "test -f src/hooks/useCart.ts"
check_item "src/hooks/useOrders.ts" "test -f src/hooks/useOrders.ts"
echo ""

# Check environment variables
echo "🔐 Checking Environment Variables..."
if grep -q "VITE_API_BASE_URL" .env.local 2>/dev/null; then
  echo -e "${GREEN}✓${NC} VITE_API_BASE_URL is set"
  checks_passed=$((checks_passed + 1))
else
  echo -e "${RED}✗${NC} VITE_API_BASE_URL is NOT set"
fi
checks_total=$((checks_total + 1))

if grep -q "VITE_STRIPE_PUBLISHABLE_KEY" .env.local 2>/dev/null; then
  echo -e "${GREEN}✓${NC} VITE_STRIPE_PUBLISHABLE_KEY is set"
  checks_passed=$((checks_passed + 1))
else
  echo -e "${RED}✗${NC} VITE_STRIPE_PUBLISHABLE_KEY is NOT set (REQUIRED for Stripe)"
fi
checks_total=$((checks_total + 1))
echo ""

# Summary
echo "======================================"
echo "📊 Verification Summary"
echo "======================================"
echo "Passed: $checks_passed/$checks_total checks"
echo ""

if [ $checks_passed -lt $checks_total ]; then
  echo -e "${YELLOW}⚠️  Some checks failed. Please address the issues above.${NC}"
  echo ""
  echo "Next steps:"
  echo "1. Check .env.local file exists with proper values"
  echo "2. Run 'npm install' to install all dependencies"
  echo "3. Run 'npm run dev' to start development server"
  exit 1
else
  echo -e "${GREEN}✅ All checks passed! Your setup is ready.${NC}"
  echo ""
  echo "Quick start:"
  echo "1. npm run dev              # Start development server"
  echo "2. Open http://localhost:5173"
  echo "3. Test the checkout flow"
  echo ""
  exit 0
fi
