const { PrismaClient } = require('@prisma/client');
const { createUserByEmailAndPassword } =require('../src/api/users/users.services');

const prisma = new PrismaClient();

async function seed() {
    await prisma.role.createMany({
        data: [
            { name: 'Admin' },
            { name: 'Requester' },
            { name: 'Approver' },
        ],
        });

  const roles = await prisma.role.findMany();

  let email = "admin@example.com"
  let password = "adminpassword"
  let user = await createUserByEmailAndPassword({email , password});
  delete user.password
  console.log(user)

  const admin = await prisma.user.update({
    where:{
        email:'admin@example.com'
    },
    data: {
      roles: {
        connect: roles.map((role) => ({ id: role.id })),
      },
    },
  });

  email = "requester@example.com"
  password = "requesterpassword"
  user = await createUserByEmailAndPassword({email , password});
  delete user.password
  console.log(user)

  const requester = await prisma.user.update({
    where:{
        email
    },
    data: {
      roles: {
        connect: [{ id: roles.find((role) => role.name === 'Requester').id }],
      },
    },
  });

  email = "approver@example.com"
  password = "approverpassword"
  user = await createUserByEmailAndPassword({email , password});
  delete user.password
  console.log(user)
  const approver = await prisma.user.update({
    where:{
        email    
    },
    data: {
      roles: {
        connect: [{ id: roles.find((role) => role.name === 'Approver').id }],
      },
    },
  });

  email = "mixedroles@example.com"
  password = "mixedrolespassword"
  user = await createUserByEmailAndPassword({email , password});
  delete user.password
  console.log(user)
  const mixedRoles = await prisma.user.update({
    where:{
        email    
    },
    data: {
      roles: {
        connect: roles.slice(0, 2).map((role) => ({ id: role.id })),
      },
    },
  });

  console.log('Users created:');
  console.log(admin);
  console.log(requester);
  console.log(approver);
  console.log(mixedRoles);
}

seed()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });