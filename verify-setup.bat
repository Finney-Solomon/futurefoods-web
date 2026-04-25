@echo off
REM Future Foods Setup Verification Script for Windows
REM Run this to verify all dependencies are installed and configured

setlocal enabledelayedexpansion

echo ======================================
echo Checking Future Foods Setup...
echo ======================================
echo.

set /a checks_passed=0
set /a checks_total=0

REM Helper function to check if command exists
REM Check Node.js
echo Checking Node Environment...
where node >nul 2>nul
if %errorlevel% equ 0 (
    echo [PASS] Node.js installed
    set /a checks_passed+=1
) else (
    echo [FAIL] Node.js NOT installed
)
set /a checks_total+=1

REM Check npm
where npm >nul 2>nul
if %errorlevel% equ 0 (
    echo [PASS] npm installed
    set /a checks_passed+=1
) else (
    echo [FAIL] npm NOT installed
)
set /a checks_total+=1
echo.

REM Check files exist
echo Checking Required Files...
if exist ".env.local" (
    echo [PASS] .env.local exists
    set /a checks_passed+=1
) else (
    echo [FAIL] .env.local NOT found - Create from .env.example
)
set /a checks_total+=1

if exist "src\services\apiService.ts" (
    echo [PASS] src\services\apiService.ts
    set /a checks_passed+=1
) else (
    echo [FAIL] src\services\apiService.ts NOT found
)
set /a checks_total+=1

if exist "src\services\stripeService.ts" (
    echo [PASS] src\services\stripeService.ts
    set /a checks_passed+=1
) else (
    echo [FAIL] src\services\stripeService.ts NOT found
)
set /a checks_total+=1

if exist "src\providers\StripeProvider.tsx" (
    echo [PASS] src\providers\StripeProvider.tsx
    set /a checks_passed+=1
) else (
    echo [FAIL] src\providers\StripeProvider.tsx NOT found
)
set /a checks_total+=1

if exist "src\components\PaymentForm.tsx" (
    echo [PASS] src\components\PaymentForm.tsx
    set /a checks_passed+=1
) else (
    echo [FAIL] src\components\PaymentForm.tsx NOT found
)
set /a checks_total+=1

if exist "src\components\Checkout.tsx" (
    echo [PASS] src\components\Checkout.tsx
    set /a checks_passed+=1
) else (
    echo [FAIL] src\components\Checkout.tsx NOT found
)
set /a checks_total+=1

if exist "src\hooks\useCart.ts" (
    echo [PASS] src\hooks\useCart.ts
    set /a checks_passed+=1
) else (
    echo [FAIL] src\hooks\useCart.ts NOT found
)
set /a checks_total+=1

if exist "src\hooks\useOrders.ts" (
    echo [PASS] src\hooks\useOrders.ts
    set /a checks_passed+=1
) else (
    echo [FAIL] src\hooks\useOrders.ts NOT found
)
set /a checks_total+=1
echo.

REM Check npm packages
echo Checking npm Packages...
npm ls @stripe/react-stripe-js >nul 2>nul
if %errorlevel% equ 0 (
    echo [PASS] @stripe/react-stripe-js
    set /a checks_passed+=1
) else (
    echo [FAIL] @stripe/react-stripe-js NOT installed
)
set /a checks_total+=1

npm ls @stripe/stripe-js >nul 2>nul
if %errorlevel% equ 0 (
    echo [PASS] @stripe/stripe-js
    set /a checks_passed+=1
) else (
    echo [FAIL] @stripe/stripe-js NOT installed
)
set /a checks_total+=1

npm ls react-router-dom >nul 2>nul
if %errorlevel% equ 0 (
    echo [PASS] react-router-dom
    set /a checks_passed+=1
) else (
    echo [FAIL] react-router-dom NOT installed
)
set /a checks_total+=1
echo.

REM Summary
echo ======================================
echo Verification Summary
echo ======================================
echo Passed: %checks_passed%/%checks_total% checks
echo.

if %checks_passed% lss %checks_total% (
    echo WARNING: Some checks failed. Please fix the issues above.
    echo.
    echo Next steps:
    echo 1. Copy .env.example to .env.local
    echo 2. Update .env.local with your Stripe key
    echo 3. Run: npm install
    echo 4. Run: npm run dev
    exit /b 1
) else (
    echo SUCCESS: All checks passed! Your setup is ready.
    echo.
    echo Quick start:
    echo 1. Run: npm run dev
    echo 2. Open: http://localhost:5173
    echo 3. Test the checkout flow with card: 4242 4242 4242 4242
    echo.
    exit /b 0
)

endlocal
