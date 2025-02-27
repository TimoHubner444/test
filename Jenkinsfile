pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'custom-docker-image'  // Name for your custom Docker image
        EC2_PRIVATE_KEY = credentials('ec2-private-key')  // Stored in Jenkins Credentials Manager
        EC2_USER = 'ec2-user'  // Default user for Amazon Linux or adjust based on your AMI (e.g., ubuntu for Ubuntu AMIs)
        EC2_HOST = '54.163.20.34'
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

        stage('Build Custom Docker Image') {
            steps {
                dir('frontend') {
                    // Build your custom Docker image from the Dockerfile in the frontend directory
                    sh 'docker build -t ${DOCKER_IMAGE} -f test/frontend/${DOCKER_IMAGE} .'

                }
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('frontend') {
                    sh 'npm install -g @angular/cli@17'
                    sh 'npm install'
                    sh 'npm install karma --save-dev'
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

        stage('Unit Tests in Custom Docker') {
            steps {
                script {
                    // Start a container using your custom Docker image for running unit tests
                    sh """
                        docker run --rm -v \$(pwd)/frontend:/app -w /app ${DOCKER_IMAGE} bash -c '
                            ng test --watch=false --browsers=ChromeHeadless'
                    """
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
