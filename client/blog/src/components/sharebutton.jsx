import { FacebookShareButton, TwitterShareButton, LinkedinShareButton } from 'react-share';

const ShareButtons = ({ shareableLink }) => {
  return (
    <div>
      <FacebookShareButton url={shareableLink}>
        Share on Facebook
      </FacebookShareButton>
      <TwitterShareButton url={shareableLink}>
        Share on Twitter
      </TwitterShareButton>
      <LinkedinShareButton url={shareableLink}>
        Share on LinkedIn
      </LinkedinShareButton>
    </div>
  );
};
