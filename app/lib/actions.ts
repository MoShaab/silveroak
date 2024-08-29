'use server';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import path from 'path';
import { writeFile } from 'fs/promises';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

const FormSchema = z.object({
    title: z.string(),
    description: z.string(),
    price: z.coerce.number(),
    location: z.string(),
    images: z.instanceof(File),
});

export async function createListing(formData: FormData) {
    const { title, description, price, location, images } = FormSchema.parse({
        title: formData.get('title'),
        description: formData.get('description'),
        price: formData.get('price'),
        location: formData.get('location'),
        images: formData.get('images'),
    });

    // Define file name and path
    const filename = `${Date.now()}_${images.name.replace(/\s/g, '_')}`;
    const imagePath = path.join('public/uploads', filename);

    try {
        // Write file to the public/uploads directory
        const buffer = Buffer.from(await images.arrayBuffer());
        await writeFile(path.join(process.cwd(), imagePath), buffer);

        // Insert listing into the database with the correct image path
        await sql`
        INSERT INTO properties (title, description, price, location, image_path)
        VALUES (${title}, ${description}, ${price}, ${location}, ${'/uploads/' + filename})
        `;

        
         
    } catch (error) {
        console.error('Error occurred while creating the listing:', error);
        throw new Error('Failed to create listing.'); // Handle this appropriately
    }
    // Revalidate and redirect after successful insertion
    revalidatePath('/properties/success');
    redirect('/properties/success');
}

export async function updateListing(id: string, formData: FormData) {
    const {  title, description, price, location, images  } = FormSchema.parse({
        title: formData.get('title'),
        description: formData.get('description'),
        price: formData.get('price'),
        location: formData.get('location'),
        images: formData.get('images'),
    });
    const filename = `${Date.now()}_${images.name.replace(/\s/g, '_')}`;
    const imagePath = path.join('public/uploads', filename);
   
    try{
        const buffer = Buffer.from(await images.arrayBuffer());
        await writeFile(path.join(process.cwd(), imagePath), buffer);

        await sql`
        UPDATE properties
        SET title = ${title}, description = ${description},  price = ${price}, location = ${location}, image_path = ${'/uploads/' + filename}
        WHERE id = ${id}
      `;

    } catch (error) {
        console.error('Error occurred while update the listing:', error);
        throw new Error('Failed to update listing.'); // Handle this appropriately
    }
    
   
   
   
    revalidatePath('/properties/success');
    redirect('/properties/success');
}


export async function deleteListing(id: string) {
    await sql`DELETE FROM properties WHERE id = ${id}`;
    revalidatePath('/properties');
  }

  export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
  ) {
    try {
      await signIn('credentials', formData);
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return 'Invalid credentials.';
          default:
            return 'Something went wrong.';
        }
      }
      throw error;
    }
  }