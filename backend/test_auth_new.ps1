
$api = "http://localhost:5000"
$rand = Get-Random
$email = "testUser$rand@gmail.com"
$username = "TestUser$rand"
$password = "password123"

Write-Host "1. Testing Signup for $username ($email)..."
$signupBody = @{
    email    = $email
    password = $password
    username = $username
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$api/signup" -Method Post -Body $signupBody -ContentType "application/json"
    Write-Host "Signup Success: $($response.message)" -ForegroundColor Green
}
catch {
    Write-Host "Signup Failed: $_" -ForegroundColor Red
    exit
}

Write-Host "`n2. Testing Login..."
$loginBody = @{
    email    = $email
    password = $password
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$api/login" -Method Post -Body $loginBody -ContentType "application/json"
    
    if ($response.user.username -eq $username) {
        Write-Host "Login Success! Username returned: $($response.user.username)" -ForegroundColor Green
        Write-Host "User Email: $($response.user.email)" -ForegroundColor Green
    }
    else {
        Write-Host "Login Failed to return correct username. Got: $($response.user.username)" -ForegroundColor Red
    }
}
catch {
    Write-Host "Login Failed: $_" -ForegroundColor Red
}
