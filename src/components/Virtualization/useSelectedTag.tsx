import * as React from 'react';

/**
 * Redoc has a unique "tag" that serves as an anchor when user clicks
 * their sidebar.
 *
 * For example, the tag looks like "tag/myproduct-mynamespace-myendpoint".
 * It transforms a hash from the url into those of Redoc tag. For example,
 * transforms "#tag/myendpoint" into "tag/myendpoint".
 */
export const toRedocTag = (hash: string) => {
  const decodedHash = decodeURIComponent(hash);
  return decodedHash.substring(1, decodedHash.length);
};

/**
 * Helps in retrieving the redoc tag user currently activates.
 * This is to help to redirect user into the associated API endpoint in the
 * Virtualization Content as the traditional HTML mechanism to redirect into anchor
 * cannot happen as not everything is rendered initially in the Virtualization Content.
 */
const useSelectedTag = () => {
  const [selectedTag, setSelectedTag] = React.useState('');

  React.useEffect(() => {
    const hashCheckInterval = setInterval(() => {
      const redocTag = toRedocTag(window.location.hash);
      console.log(redocTag);
      if (redocTag !== selectedTag) {
        setSelectedTag(redocTag);
      }
    }, 100);

    return () => {
      clearInterval(hashCheckInterval);
    };
  }, [selectedTag]);

  return selectedTag;
};

export default useSelectedTag;
