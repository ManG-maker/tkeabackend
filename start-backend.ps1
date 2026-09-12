Push-Location 'C:\Users\DELL\Desktop\New\Electronics-eCommerce-Shop-With-Admin-Dashboard-NextJS-NodeJS\server'
try {
    Write-Host "Starting backend server..."
    & node app.js
} finally {
    Pop-Location
}
