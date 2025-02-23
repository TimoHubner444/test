pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'frontend/Dockerfile'
        
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/TimoHubner444/test.git'
            }
        }
        stage('Install Dependencies') {
            steps {
                // Installeer de Node.js dependencies
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                
                sh 'ng build --prod'
            }
        }

        stage('Unit Tests') {
            steps {
                
                sh 'ng test --watch=false --browsers=ChromeHeadless'
            }
        }

        stage('End-to-End Tests') {
            steps {
                // Voer de end-to-end tests uit met Protractor (of een andere tool die je gebruikt)
                sh 'ng e2e --prod'
            }
        }

    }

    post {
        always {
            cleanWs()
        }  
    }
}
