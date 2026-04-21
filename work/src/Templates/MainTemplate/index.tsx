import Container from "../../components/Container";
import Content from "../../components/Content";
import Menu from "../../components/Menu";
import styles from'./styles.module.css'

type MainTemplastesPropos={
  children: React.ReactNode;
};


function MainTemplate({children} : MainTemplastesPropos){
  return (
    <>
    <Container className={styles.containerHeader}>
      <Content className={styles.contentHeader}>
        <Menu />
      </Content>
    </Container>
    <Container>
      <Content>
        {children}
      </Content>
    </Container>
    </>
  )
}
export default MainTemplate