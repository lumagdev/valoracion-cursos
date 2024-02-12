import { message } from 'antd';

export const useAlertMessage = (type, content) => 
{
    const [messageApi, contextHolder] = message.useMessage();

    const handleAlertMessage = () => {
        messageApi.open({
            type: `${type}`,
            content: `${content}`,
        });
    };

    return {
        handleAlertMessage,
        contextHolder
    }
}