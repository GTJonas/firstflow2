const path = require('path');

module.exports = {
    mode: 'development', // or 'production' if you prefer
    entry: './src/components/RightSidebar.tsx', // Replace with the actual path to your component
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'build'), // Replace 'build' with your desired output directory
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
};
