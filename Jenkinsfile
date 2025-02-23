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
                dir('frontend') {
                    // Installeer de Angular CLI globaal
                    sh 'npm install -g @angular/cli'
                    // Installeer de overige dependencies in de frontend map
                    sh 'npm install'
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

