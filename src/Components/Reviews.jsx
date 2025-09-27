import React, { useState, useEffect, useCallback } from 'react';
import { getReviewsByProduct, createReview, updateReview } from '../Service/Review';
import toast from 'react-hot-toast';

const StarRating = ({ rating, setRating }) => (
    <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
            <svg
                key={star}
                onClick={() => setRating(star)}
                className={`w-6 h-6 cursor-pointer ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))}
    </div>
);

// A simple blocklist of inappropriate words. Should mirror the backend.
const blocklist = ["damn", "hell", "crap", "idiot", "stupid", "dumb", "fool"];

// Helper function to check for blocked words (case-insensitive)
const containsBlockedWords = (text) => {
    if (!text) return false;
    const lowerCaseText = text.toLowerCase();
    return blocklist.some(word => lowerCaseText.includes(word));
};


export default function Reviews({ productId }) {
    const [reviews, setReviews] = useState([]);
    const [userReview, setUserReview] = useState(null);
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    
    const userId = JSON.parse(localStorage.getItem('user'))?._id;

    const fetchReviews = useCallback(async () => {
        try {
            const productReviews = await getReviewsByProduct(productId);
            setReviews(productReviews);
            const existingUserReview = productReviews.find(r => r.user._id === userId);
            if (existingUserReview) {
                setUserReview(existingUserReview);
                setRating(existingUserReview.rating);
                setReviewText(existingUserReview.review);
                setIsEditing(true);
            }
        } catch (error) {
            console.error("Could not fetch reviews:", error);
        }
    }, [productId, userId]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);
    
    const proceedWithUpdateReview = async () => {
        try {
            await updateReview(userReview._id, { rating, review: reviewText });
            toast.success("Review updated successfully!");
            fetchReviews();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (rating === 0 || !reviewText) {
            return toast.error("Please provide a rating and a review.");
        }

        if (containsBlockedWords(reviewText)) {
            return toast.error("Your review contains inappropriate language.");
        }
        
        const reviewData = { productId, rating, review: reviewText };

        if (isEditing) {
            toast((t) => (
                <div className="flex flex-col items-center gap-2">
                    <p className="font-semibold">Confirm your review update?</p>
                    <div className="flex gap-4">
                        <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded" onClick={() => { proceedWithUpdateReview(); toast.dismiss(t.id); }}>
                            Confirm
                        </button>
                        <button className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded" onClick={() => toast.dismiss(t.id)}>
                            Cancel
                        </button>
                    </div>
                </div>
            ));
        } else {
            try {
                await createReview(reviewData);
                toast.success("Thank you for your review!");
                fetchReviews();
            } catch (error) {
                toast.error(error.message);
            }
        }
    };

    return (
        <div className="mt-8 pt-6 border-t">
            <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <h3 className="font-semibold text-lg mb-2">{isEditing ? "Edit Your Review" : "Write a Review"}</h3>
                <form onSubmit={handleSubmitReview}>
                    <StarRating rating={rating} setRating={setRating} />
                    <textarea 
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Share your thoughts about the product..."
                        className="w-full p-2 border rounded mt-4"
                        rows="4"
                    />
                    <button type="submit" className="mt-4 bg-teal-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-teal-700">
                        {isEditing ? "Update Review" : "Submit Review"}
                    </button>
                </form>
            </div>
            <div className="space-y-6">
                {reviews.length > 0 ? reviews.map(review => (
                    <div key={review._id} className="border-b pb-4">
                        <div className="flex items-center mb-2">
                             <div className="flex space-x-1">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                ))}
                            </div>
                            <p className="ml-4 font-bold">{review.user.email}</p>
                        </div>
                        <p className="text-gray-700">{review.review}</p>
                    </div>
                )) : <p>No reviews yet. Be the first to write one!</p>}
            </div>
        </div>
    );
}