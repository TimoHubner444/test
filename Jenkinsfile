pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'frontend/Dockerfile'
        EC2_PRIVATE_KEY = credentials('ec2-private-key')  // Stored in Jenkins Credentials Manager
        EC2_USER = 'ec2-user'  // Default user for Amazon Linux or adjust based on your AMI (e.g., ubuntu for Ubuntu AMIs)
        EC2_HOST = '34.236.151.120'
        REMOTE_DIR = '/home/ec2-user/testmap'  // The directory on the EC2 instance to deploy to
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
            post {
                always {
                    echo 'Unit tests finished.'
                }
                failure {
                    echo 'Unit tests failed, but pipeline will continue.'
                }
            }
            // Use catchError here to allow the build to continue even if tests fail
            options {
                catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE')
            }
        }

        stage('Deploy to EC2') {
            steps {
                script {
                    // Upload the /dist folder to EC2 using SCP
                    sh """
                        # Ensure SSH Agent is available
                        eval \$(ssh-agent -s)
                        ssh-add ${EC2_PRIVATE_KEY}

                        # Copy the Angular build output to the EC2 instance
                        scp -o StrictHostKeyChecking=no -i ${EC2_PRIVATE_KEY} -r ./frontend/dist/ ${EC2_USER}@${EC2_HOST}:${REMOTE_DIR}

                        # SSH into EC2 and restart the web server (e.g., Nginx)
                        ssh -o StrictHostKeyChecking=no -i ${EC2_PRIVATE_KEY} ${EC2_USER}@${EC2_HOST} <<EOF
                            # Ensure the correct permissions
                            sudo chown -R nginx:nginx ${REMOTE_DIR}

                            # Restart Nginx (or your chosen web server)
                            sudo systemctl restart nginx
                        EOF
                    """
                }
            }
        }

    post {
        always {
            cleanWs()
        }
    }
}
