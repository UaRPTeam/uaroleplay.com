import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'imageGalleryCarousel',
  title: 'Image Gallery Carousel',
  type: 'object',
  fields: [
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt',
              type: 'string',
            }),
          ],
        }),
      ],
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: 'rounded',
      type: 'boolean',
      title: 'Rounded corners',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      images: 'images',
    },
    prepare(selection) {
      const count = Array.isArray(selection.images) ? selection.images.length : 0
      return {
        title: 'Image Gallery Carousel',
        subtitle: count ? `${count} image(s)` : 'No images',
      }
    },
  },
})
