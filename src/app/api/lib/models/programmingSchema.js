import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ProgrammingSchema = new Schema({
    dataFancybox: {
        type: String,
        required: true
    },
    contentType: {
        type: String,
        required: true
    },
    itemType: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: false
    },
    icons: {
        type: [String],
        default: []
    },
    'data-date': {
        type: String,
        required: true
    },
    isFeatured: {
        type: Boolean,
        required: true
    },
    isArchived: {
        type: Boolean,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        required: true
    },
    abbreviatedTitle: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    imgSrc: {
        type: String,
        required: true
    },
    imgSrcAlt: {
        type: String,
        required: true
    },
    fallbackImgSrc: {
        type: String,
        default: ''
    },
    href: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    collection: 'programming'
});

export default mongoose.models.ProgrammingDB || mongoose.model('ProgrammingDB', ProgrammingSchema);