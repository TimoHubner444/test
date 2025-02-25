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
            // Voeg allowFailure toe om de pipeline te laten doorgaan als de tests falen
            post {
                always {
                    echo 'Unit tests finished.'
                }
                failure {
                    echo 'Unit tests failed, but pipeline will continue.'
                }
            }
            options {
                // Laat de build doorgaan, zelfs als de tests falen
                allowFailure()
            }
        }

       stage('hella') {
            steps {
               echo 'hello'
            }
        } 
    

    post {
        always {
            cleanWs()
        }
    }
}

