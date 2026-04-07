import { supabase } from '@/lib/supabase'
import { uploadFiles } from '@/lib/uploadFiles'

const handleSubmit = async (event) => {

    event.preventDefault()

    setLoading(true)

    try {

        const uploaded = await uploadFiles(
            files,
            'employment-documents',
            'applications'
        )

        const fileUrls = uploaded.map(f => f.path)
        const fileNames = uploaded.map(f => f.name)

        const { error } = await supabase
            .from('employment_applications')
            .insert({
                full_name: event.target.name.value,
                email: event.target.email.value,
                phone: event.target.phone.value,
                position: event.target.position.value,
                location: event.target.location.value,
                experience: event.target.experience.value,
                adr_licence: event.target.adr_licence.value,
                licence_type: event.target.licence_type.value,
                message: event.target.message.value,
                job_id: event.target.job_id.value,
                file_urls: fileUrls,
                file_names: fileNames
            })

        if (error) throw error

        router.push('/thank-you')

    } catch (error) {

        console.error(error)
        alert('Upload failed')

    } finally {

        setLoading(false)

    }
}