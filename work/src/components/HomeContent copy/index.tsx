import MainTemplate from "../../Templates/MainTemplate";
import Content from "../Content";
import styles from './styles.module.css'


function HomeContent() {

    return (
    <>

    <MainTemplate>   
        <Content className={styles.content}>


         <h2 className="text-4xl text-amber-50">Barbearia King Size</h2>
         
        
        </Content>
  
    </MainTemplate>   
    </>
      )
    }
    
    export default HomeContent;