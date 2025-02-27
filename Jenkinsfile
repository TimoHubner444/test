pipeline {
    agent any

    environment {
        
        EC2_PRIVATE_KEY = credentials('ec2-private-key')  // Stored in Jenkins Credentials Manager
        EC2_USER = 'ec2-user'  // Default user for Amazon Linux or adjust based on your AMI (e.g., ubuntu for Ubuntu AMIs)
        EC2_HOST = '54.163.20.34'
        REMOTE_DIR = '/home/ec2-user/testmap'  // The directory on the EC2 instance to deploy to
        DOCKER_IMAGE = 'dockerfile'
        WORKSPACE_DIR = "${env.WORKSPACE}/frontend/dist" // Pad naar de dist folder in de Jenkins workspace
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

        stage('Build Docker Image') {
                steps {
                    script {
                        // Bouw de Docker-image (zorg ervoor dat je Docker geïnstalleerd hebt op je Jenkins agent)
                        sh 'docker build -f frontend/Dockerfile -t $DOCKER_IMAGE ./frontend'

                    }
                }
            }    

      

        stage('Unit Tests ') {
             steps {
                script {
                    // Start de container in de achtergrond
                    sh 'docker run -d --name angular-container $DOCKER_IMAGE'

                    // Installeer Angular CLI, Karma, en de Chrome browser in de draaiende container
                    sh 'docker exec angular-container npm install -g @angular/cli@17'
                    sh 'docker exec angular-container npm install -g karma karma-cli karma-chrome-launcher'
                    sh 'docker exec angular-container apt-get update && apt-get install -y google-chrome-stable'

                    // Voer de tests uit in de container
                    sh 'docker exec angular-container ng test --watch=false --browsers=ChromeHeadless'
                }
                
            }
            post {
                always {
                    echo 'Unit tests finished.'
                }
                failure {
                    echo 'Unit tests failed, but pipeline will continue.'
                }
            }
            options {
                catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE')
            }
        }
        stage('Build Angular Project in Docker') {
            steps {
                script {
                    // Bouw de Angular app in de Docker-container (voor de dist/ map)
                    sh 'docker exec angular-container ng build --prod'

                    // Kopieer de dist/ map van de Docker-container naar de Jenkins workspace
                    sh 'docker cp angular-container:/app/frontend/dist ./frontend/dist'

                    // Sla het artifact op in de Jenkins workspace (zorg ervoor dat het pad naar de workspace correct is)
                    sh "cp -r ./frontend/dist $WORKSPACE_DIR"
                }
            }
        }

        stage('Deploy to EC2') {  // Added a new stage for deployment
            steps {
                withCredentials([file(credentialsId: 'ec2-private-key', variable: 'EC2_PRIVATE_KEY')]) {
                    script {
                        // Secure way to use ssh-agent and the private key
                        sh """
                            eval \$(ssh-agent -s)
                            ssh-add \${EC2_PRIVATE_KEY}

                            # Ensure proper permissions on the target directory on EC2
                            ssh -o StrictHostKeyChecking=no \${EC2_USER}@\${EC2_HOST} \
                            "sudo chown -R \${EC2_USER}:\${EC2_USER} \${REMOTE_DIR} && sudo chmod -R 755 \${REMOTE_DIR}"
        
                            # Copy the Angular build output to the EC2 instance
                            scp -o StrictHostKeyChecking=no -i \${EC2_PRIVATE_KEY} -r ./frontend/dist/ \${EC2_USER}@\${EC2_HOST}:\${REMOTE_DIR}

                            # SSH into EC2 and restart the web server (e.g., Nginx)
                            ssh -o StrictHostKeyChecking=no -i \${EC2_PRIVATE_KEY} \${EC2_USER}@\${EC2_HOST} \
                                "sudo chown -R nginx:nginx \${REMOTE_DIR} && sudo systemctl restart nginx"
                        """
                    }
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
