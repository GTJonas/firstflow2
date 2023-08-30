import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';


class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            reloadCountdown: 60 // Initial countdown value
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error boundary caught an error:', error, errorInfo);
        // Start the reload countdown
        if (window.location.pathname !== "/test") {
            this.startReloadCountdown();
        }
    }

    startReloadCountdown() {
        const countdownInterval = setInterval(() => {
            this.setState(prevState => ({
                reloadCountdown: prevState.reloadCountdown - 1
            }));

            if (this.state.reloadCountdown === 1) {
                clearInterval(countdownInterval);
                const token = localStorage.getItem('token');
                if (token) {
                    // Redirect to '/' if token exists
                    window.location.href = '/';
                } else {
                    // Redirect to '/login' if token doesn't exist
                    window.location.href = '/login';
                }
            }
        }, 1000); // Countdown interval in milliseconds (1 second)
    }

    render() {
        if (this.state.hasError) {
            // Display a countdown timer before redirecting
            return (
                <div>
                    <div>Something went wrong. Redirecting in {this.state.reloadCountdown} seconds...</div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
