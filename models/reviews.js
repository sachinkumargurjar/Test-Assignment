import mongoose from 'mongoose';


const reviewsSchema = mongoose.Schema({
    pullRequestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PullRequest'
    },
    reviewerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: {
        type: String
    },
    createdAt: {
        type: Date,
        default: new Date(),
    }
})

var Reviews = mongoose.model('Reviews', reviewsSchema);

export default Reviews;