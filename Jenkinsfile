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
                // Navigeer naar de frontend directory voordat je npm install uitvoert
                dir('frontend') {
                    sh 'npm install @angular/cli --save-dev'
                    sh 'npm install'
                }
            }
        }

        stage('Build') {
            steps {
                dir('frontend') {
                    sh 'ng build --prod'
                }
            }
        }

        stage('Unit Tests') {
            steps {
                dir('frontend') {
                    sh 'ng test --watch=false --browsers=ChromeHeadless'
                }
            }
        }

        stage('End-to-End Tests') {
            steps {
                dir('frontend') {
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

