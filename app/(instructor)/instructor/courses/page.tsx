import {auth} from '@clerk/nextjs/server'
import {redirect} from "next/navigation"
import Link from 'next/link'
import { db } from "@/lib/db";

import { Button } from "@/components/ui/button";

const CoursesPage = async () => {
    const {userId} = auth()

    if (!userId)  {
        return redirect('/sign-in')
    }

    const courses = await db.course.findMany({
        where:{
            instructorId: userId
        },
        orderBy:{
            createdAt: 'desc'
        }
    })

    return (
        <div className='px-6 py-4'>
            <Link href='/instructor/create-course'>
            <Button>
                Criar Novo Curso
            </Button>
            <div className='mt-10'>
                {courses.map((course) => (
                    <Link href={`/instructor/courses/${course.id}/basic`} key={course.id} >{course.title}</Link>
                ))}
            </div>
            </Link>
        </div>
    )
}

export default CoursesPage;