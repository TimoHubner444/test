pipeline {
    agent any

        environment {
            // Pad naar je docker-compose.yml bestand (meestal in de root van je repository)
            COMPOSE_FILE = 'infra/compose.yml'
        }
    
          stages {
            stage('Checkout') {
                steps {
                    script {
                        // Checkout the main branch from your Git repository
                        git branch: 'main', url: 'https://github.com/TimoHubner444/test.git'
                        sh 'cd frontend'
                    }
                }
            }
            stage('Insalling dependecies') {
              steps{
                  nodejs('TINnode-devops'){
                        sh ' npm install' 
                        sh' npm install -g @angular/cli'
                        
                    }
                  }
            }
            stage('Run unit and e2e tests') {
                steps{
                    
                    sh 'ng test' 
                    sh 'ng add playwright-ng-schematics'
                    sh ' ng e2e'
                }
            }
        
        }
    }



