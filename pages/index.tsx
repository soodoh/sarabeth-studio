import type { NextPage, GetStaticProps } from 'next';
import styles from '../styles/Home.module.css';
import PageLayout from '../components/PageLayout';
import { getCommonData, getClient, CommonData } from '../util/contentful-util';

interface Props {
  commonData: CommonData;
}

const Home = (props: Props) => {
  return (
    <PageLayout
      metadata={{
        title: "Sarabeth Belón: Portfolio",
        description: "Sarabeth Belon, a young female opera singer, captivates audiences with her tessitura and repertoire versatility. Learn more about this artist!",
        keywords: ['young female opera singer', 'opera singer los angeles'],
      }}
      commonData={props.commonData}
    >
      <div className={styles.container}>
        Some stuff
        Some stuff
        Some stuff
      </div>
      Some stuff
    </PageLayout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const commonData = await getCommonData();
  return { props: { commonData } };
};

export default Home;
