import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { Flex, Heading, Text } from "@radix-ui/themes";
import {  PACKAGE_ID } from '../config';
export function MyDiary() {
  const account = useCurrentAccount();
  const { data: ownedObjects, isPending: isLoadingOwned, error: ownedError } = useSuiClientQuery(
    "getOwnedObjects",
    {
      owner: account?.address as string,
      filter: {
        Package: `${PACKAGE_ID}`
      }
    },
    {
      enabled: !!account,
    },
  );

  const objectIds = ownedObjects?.data.map(obj => obj.data?.objectId) || [];
  const { data: diaryDetails, isPending: isLoadingDetails, error: detailsError } = useSuiClientQuery(
    "multiGetObjects",
    {
      ids: objectIds,
      options: { showContent: true }
    },
    {
      enabled: !!objectIds.length,
    },
  );

  if (!account) {
    return <Text>Please connect your wallet to view your diaries</Text>;
  }

  if (ownedError || detailsError) {
    return <Flex>Error: {(ownedError || detailsError)?.message}</Flex>;
  }

  if (isLoadingOwned || isLoadingDetails || !diaryDetails) {
    return <Flex>Loading your diaries...</Flex>;
  }

  const sortedDiaries = [...diaryDetails].sort((a, b) => {
    const dateA = new Date(a.data?.content.fields.date);
    const dateB = new Date(b.data?.content.fields.date);
    return dateB.getTime() - dateA.getTime(); // 降序排列，最新的在前
  });

  return (
    <Flex direction="column" gap="4" style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <Heading size="4" style={{ 
        marginBottom: '20px',
        background: 'linear-gradient(45deg, #00ffff, #ff00ff)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textAlign: 'center'
      }}>
        My Future Diaries Timeline
      </Heading>
      {diaryDetails.length === 0 ? (
        <Text style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)' }}>
          No diary entries found
        </Text>
      ) : (
        <Flex direction="column" gap="6" style={{ position: 'relative' }}>
          <div style={{
            position: 'absolute',
            left: '24px',
            top: 0,
            bottom: 0,
            width: '2px',
            background: 'rgba(255, 255, 255, 0.1)',
          }} />
          
          {sortedDiaries.map((diary) => (
            <Flex 
              key={diary.data?.objectId} 
              direction="column" 
              gap="3"
              style={{
                padding: '24px',
                paddingLeft: '64px',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
                position: 'relative',
              }}
            >
              <div style={{
                position: 'absolute',
                left: '20px',
                top: '32px',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #00ffff, #ff00ff)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
              }} />
              
              <Text weight="medium" style={{ 
                fontSize: '16px', 
                color: 'rgba(255, 255, 255, 0.7)',
                letterSpacing: '0.5px'
              }}>
                Date: {diary.data?.content.fields.date}
              </Text>
              <Text style={{ 
                fontSize: '18px', 
                lineHeight: '1.6',
                color: 'rgba(255, 255, 255, 0.9)',
                letterSpacing: '0.3px'
              }}>
                {diary.data?.content.fields.content}
              </Text>
              <img 
                src={diary.data?.content.fields.image_url} 
                alt="Diary Image" 
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                  marginTop: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              />
            </Flex>
          ))}
        </Flex>
      )}
    </Flex>
  );
} 