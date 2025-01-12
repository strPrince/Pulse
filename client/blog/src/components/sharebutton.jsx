import { FacebookShareButton, TwitterShareButton, LinkedinShareButton } from 'react-share';
import { FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';

const ShareButtons = ({ shareableLink }) => {
  return (
    <div>
      <FacebookShareButton url={shareableLink}>
        <FaFacebook size={20} />
      </FacebookShareButton>
      <TwitterShareButton url={shareableLink}>
        <FaTwitter size={20} />
      </TwitterShareButton>
      <LinkedinShareButton url={shareableLink}>
        <FaLinkedin size={20} />
      </LinkedinShareButton>
    </div>
  );
};

export default ShareButtons;
