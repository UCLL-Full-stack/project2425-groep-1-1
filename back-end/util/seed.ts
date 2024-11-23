import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { set } from 'date-fns'


const prisma = new PrismaClient();