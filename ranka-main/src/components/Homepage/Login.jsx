  import React, { useState } from "react";
  import { Eye, EyeOff, Loader, User } from "lucide-react";

  const LoginPage = () => {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState("");
    const [errors, setErrors] = useState({ identifier: "", password: "" });

    const validateIdentifier = (value) => {
      return value.length >= 3;
    };

    const handleIdentifierChange = (e) => {
      const value = e.target.value;
      setIdentifier(value);
      setApiError("");

      if (!validateIdentifier(value) && value) {
        setErrors((prev) => ({
          ...prev,
          identifier: "Please enter a valid username (min 3 characters)"
        }));
      } else {
        setErrors((prev) => ({ ...prev, identifier: "" }));
      }
    };

    const handlePasswordChange = (e) => {
      const value = e.target.value;
      setPassword(value);
      setApiError("");

      if (value.length < 8 && value) {
        setErrors((prev) => ({
          ...prev,
          password: "Password must be at least 8 characters"
        }));
      } else {
        setErrors((prev) => ({ ...prev, password: "" }));
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      // Check if form fields are valid before proceeding
      if (!errors.identifier && !errors.password && identifier && password) {
        setIsLoading(true); // Start loading spinner
        setApiError(""); // Clear previous API errors if any
    
        try {
          // Sending login request
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              login: identifier,
              password: password,
            }),
          });
    
          // Handle API response
          const data = await response.json();
    
          if (response.ok) {
            // Success handling: Save to localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('roles', JSON.stringify(data.user.roles));
    
            // Display success message
            const successToast = document.createElement('div');
            successToast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded shadow-lg';
            successToast.textContent = data.message || "Login successful!";
            document.body.appendChild(successToast);
            setTimeout(() => successToast.remove(), 3000);
    
            // Redirect based on user role
            if (data.user.roles.includes('Admin')) {
              window.location.href = '/admin';
            } else if (data.user.roles.includes('Staff')) {
              window.location.href = '/dashboard';
            }
          } else {
            // Adjusted to check `error` key in the response
            setApiError(data.error || 'Login failed. Please try again.');
          }
        } catch (error) {
          // Catch network or unexpected errors
          setApiError('Network error. Please try again later.');
        } finally {
          // Reset loading state
          setIsLoading(false);
        }
      } else {
        // Handle validation errors if form fields are not valid
        setApiError("Please fill out the form correctly.");
      }
    };
    
    

    return (
      <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="w-full md:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-xl">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 text-center mb-2">
                Welcome Back
              </h2>
              <p className="text-center text-gray-600 mb-8">
                Sign in to continue your journey
              </p>
            </div>

            {apiError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <label
                  htmlFor="identifier"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Username
                </label>
                <div className="relative">
                  <input
                    id="identifier"
                    name="identifier"
                    type="text"
                    autoComplete="username"
                    required
                    value={identifier}
                    onChange={handleIdentifierChange}
                    className={`mt-1 block w-full px-4 py-3 pl-10 border ${errors.identifier ? "border-red-500" : "border-gray-300"} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50`}
                    placeholder="Enter your username"
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <User size={16} />
                  </span>
                </div>
                {errors.identifier && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.identifier}
                  </p>
                )}
              </div>

              <div className="relative">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={handlePasswordChange}
                    className={`mt-1 block w-full px-4 py-3 border ${errors.password ? "border-red-500" : "border-gray-300"} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 pr-10`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.password}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || errors.identifier || errors.password}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader className="animate-spin h-5 w-5" />
                ) : (
                  "Sign in"
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="hidden md:block w-1/2 bg-cover bg-center relative">
          <img 
            src="https://images.unsplash.com/photo-1533750349088-cd871a92f312?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Login background" 
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center text-white px-8">
              <h1 className="text-5xl font-bold mb-6">
                Welcome to Our Platform
              </h1>
              <p className="text-xl max-w-md mx-auto">
                Your journey to success begins here. Sign in to access your personalized experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default LoginPage;