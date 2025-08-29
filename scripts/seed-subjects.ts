// scripts/seed-subjects.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const subjects = [
    {
        name: "Toán học",
        code: "MATH",
        description: "Toán học cơ bản và nâng cao"
    },
    {
        name: "Vật lý",
        code: "PHYS",
        description: "Vật lý đại cương và chuyên ngành"
    },
    {
        name: "Hóa học",
        code: "CHEM",
        description: "Hóa học cơ bản và hữu cơ"
    },
    {
        name: "Tiếng Anh",
        code: "ENG",
        description: "Tiếng Anh giao tiếp và học thuật"
    },
    {
        name: "Lập trình",
        code: "PROG",
        description: "Lập trình cơ bản và nâng cao"
    },
    {
        name: "JavaScript",
        code: "JS",
        description: "JavaScript và các framework"
    },
    {
        name: "Python",
        code: "PY",
        description: "Python cơ bản và ứng dụng"
    },
    {
        name: "Java",
        code: "JAVA",
        description: "Java programming và OOP"
    },
    {
        name: "React",
        code: "REACT",
        description: "React.js và ecosystem"
    },
    {
        name: "Node.js",
        code: "NODE",
        description: "Node.js và backend development"
    },
    {
        name: "Database",
        code: "DB",
        description: "SQL, NoSQL và database design"
    },
    {
        name: "Machine Learning",
        code: "ML",
        description: "Machine Learning và AI"
    },
    {
        name: "Data Science",
        code: "DS",
        description: "Data Science và Analytics"
    },
    {
        name: "Web Development",
        code: "WEB",
        description: "Full-stack web development"
    },
    {
        name: "Mobile Development",
        code: "MOBILE",
        description: "iOS và Android development"
    }
]

async function main() {
    console.log('Start seeding subjects...')

    for (const subject of subjects) {
        const result = await prisma.subject.upsert({
            where: { code: subject.code },
            update: {},
            create: subject
        })
        console.log(`Created/Updated subject: ${result.name}`)
    }

    console.log('Seeding finished.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

// To run this script:
// npx tsx scripts/seed-subjects.ts