import axios from "axios";
import useUserStore from "../../Store/useUserStore";

export const getQuestionsAndAnswersByCourseForUserReview = async (courseId, userId) => 
{
    const token = useUserStore.getState().token;
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    }

    const response = await axios.get(`http://127.0.0.1:8000/api/reviews/course/${courseId}/user/${userId}/questions-answers`, {headers})
    
    return response.data;
}