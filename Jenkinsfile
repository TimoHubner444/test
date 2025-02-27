pipeline {
    agent any

    environment {
        DOCKER_IMAGE_NAME = 'dockerfile'
        DOCKER_TAG = 'latest' // or use a dynamic tag like "${GIT_COMMIT}"
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

        

       

        stage('Build Docker Image') {
            steps {
                script {
                    // Navigate to the frontend directory and build the Docker image
                    
                    // Build Docker image from the Dockerfile in the frontend directory
                    sh "docker build -t ${DOCKER_IMAGE_NAME} -f Dockerfile.test ."
                    sh "docker run --rm ${DOCKER_IMAGE_NAME}"
                    
                }
            }
        }
        


        stage('Unit Tests ') {
             steps {
                dir('frontend') {  // Make sure you are in the correct directory
                    sh 'echo hello'
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
