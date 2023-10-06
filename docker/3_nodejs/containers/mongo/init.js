db.createUser({
    user: 'root',
    pwd: 'password',
    roles: [
      {
        role: 'readWrite',
        db: 'nginx-node-mongo-docker-example',
      },
    ],
  })