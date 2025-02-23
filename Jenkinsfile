pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'frontend/Dockerfile'
    }
    tools {
        nodejs "test-node" 
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/TimoHubner444/test.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('frontend') {
                    sh 'npm install -g @angular/cli@17'
                    // Installeer de overige dependencies in de frontend map
                    sh 'npm install'
                    sh 'npm install karma --save-dev'
                }
            }
        }

        stage('Build') {
            steps {
                dir('frontend') {
                    // Bouw de Angular applicatie
                    sh 'ng build --prod'
                }
            }
        }

        stage('Unit Tests') {
            steps {
                dir('frontend') {
                    // Voer unit tests uit
                    sh 'ng test --watch=false --browsers=ChromeHeadless'
                }
            }
        }

        stage('End-to-End Tests') {
            steps {
                dir('frontend') {
                    // Voer end-to-end tests uit
                    sh 'ng e2e --prod'
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}

