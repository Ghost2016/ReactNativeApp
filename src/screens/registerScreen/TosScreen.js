import React from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
  Dimensions,
  TextInput
} from "react-native";
import PropTypes from "prop-types";
import ConnectWithActions from "../../connectWithActions";
import { SDMainColor } from "../../styles";
import * as sdStyles from "@src/styles";
import { CSS } from "@common/SDCSS";

const styles = StyleSheet.create({
  inputWrap: {
    height: CSS.pixel(140, true),
    paddingLeft: CSS.pixel(50),
    paddingRight: CSS.pixel(80)
  },
  borderInput: {
    borderColor: "#efefef",
    borderWidth: 1,
    flexDirection: "row",
    width: CSS.pixel(480),
    height: CSS.pixel(80, true),
    marginBottom: CSS.pixel(20, true)
  },
  saveBtnBox: {
    marginBottom: CSS.pixel(40, true),
    height: CSS.pixel(72, true),
    overflow: "hidden",
    marginTop: CSS.pixel(40, true)
  }
});

//用户协议
class TosScreen extends React.Component {
  constructor(props) {
    super(props);
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };

  render() {
    return (
      <ScrollView style={{
        backgroundColor: '#fff',
      }}>
        <View style={{ flexDirection: "column", alignItems: "center" }}>
          <View style={{ marginTop: CSS.pixel(50, true) }}>
            <Text
              style={{
                fontSize: CSS.pixel(34),
                color: sdStyles.SDFontColorMain,
                fontWeight: sdStyles.SDFontBold,
              }}
            >
              《职么开门用户协议》
            </Text>
          </View>
          <View
            style={{
              paddingHorizontal: CSS.pixel(20),
              marginTop: CSS.pixel(72, true)
            }}
          >
            <Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMain,
                fontWeight: sdStyles.SDFontBold,
              }}
            >
              特别提示
            </Text>
            <Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(40, true),
                marginBottom: CSS.pixel(22, true)
              }}
            >
成都善读数据有限公司（以下简称“善读数据”）作为职么开门APP（以下简称“职么开门”）的所有权人及运营方，在此特别提醒您（用户）在注册成为用户之前，请认真阅读本《用户注册及使用协议》（以下简称“协议”），以确保您充分理解本协议中各条款。本协议构成法律上的书面协议，本协议限制、免责条款可能以黑体加粗形式提示注意。除非您已阅读并接受本协议所有条款，否则您无权使用善读数据提供的服务，您的注册、登录、使用等行为将视为您对本协议的接受，并同意接受本协议各项条款的约束。
            </Text>
            <Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(20, true),
                marginBottom: CSS.pixel(62, true)
              }}
            >

本协议约定职么开门善读数据与用户之间关于“职么开门”软件服务的权利义务。“用户”是指注册、登录、使用职么开门本服务的个人。本协议可由善读数据职么开门随时更新，更新后的协议条款一旦公布即代替原来的协议条款，恕不再另行通知，用户可在职么开门上本网站查阅最新版协议条款。在善读数据职么开门修改协议条款后，如果用户不接受修改后的条款，请立即停止使用职么开门提供的服务，用户继续使用职么开门提供的服务将被视为接受修改后的协议，当发生有关争议时，以最新的协议条款为准。
            </Text>
          </View>
          <View style={{ paddingHorizontal: CSS.pixel(20) }}>
            <Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMain,
                fontWeight: sdStyles.SDFontBold,
              }}
            >
              一、帐号注册
            </Text>
            <Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(40, true),
                marginBottom: CSS.pixel(2, true)
              }}
            >
              1、用户在使用本服务前需要注册一个“职么开门”帐号。“职么开门”帐号应当使用手机号码依照国家有关网络实名制的要求进行绑定注册，不得冒用他人身份信息或使用虚假身份信息进行注册；请用户使用尚未与“职么开门”帐号绑定的手机号码，以及未被善读数据职么开门根据本协议封禁的手机号码注册“职么开门”帐号。善读数据职么开门可以根据用户需求或产品需要对帐号注册和绑定的方式进行变更，而无须事先通知用户，且。用户应当无条件予以配合。
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true)
              }}
            >2、“职么开门”系基于大学生就业及未来职业规划的大数据产品，用户注册及使用职么开门时应当授权善读数据职么开门公开及使用其学校、专业、入学时间、毕业时间等个人信息以便为您推荐更精准的数据信息。故用户完成注册及基本资料录入即表明用户同意善读数据职么开门提取、公开及使用用户学校、专业、入学时间、毕业时间等个人信息。如用户需要终止向其他用户公开学校专业上述个人等信息，可自行退出软件注销账户不再使用职么开门服务。
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true)
              }}
            >3、鉴于“职么开门”帐号的绑定注册方式，您同意职么开门善读数据在注册时将使用您提供的手机号码及/或自动提取您的手机号码等信息用于注册。
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true)
              }}
            >4、在用户注册及使用本服务时，善读数据职么开门需要搜集能识别用户身份的个人信息以便职么开门可以在必要时联系用户，或为用户提供更好的使用体验。善读数据职么开门搜集的信息包括但不限于用户的性别、身份证信息、个人说明等；善读数据职么开门同意对这些信息的使用将受限于本协议第三条关于用户个人隐私信息保护相关条款的约束。
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true)
              }}
            >5、用户确认，在用户完成注册或以其他善读数据允许的方式实际使用职么开门服务时，用户应当是具备相应民事行为能力的自然人。若用户不具备前述主体资格，则用户及其法定监护人应承担因此而导致的一切后果，且善读数据有权注销用户帐号，并向用户及其法定监护人索赔。
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(62, true)
              }}
            >6、用户不得通过任何手段恶意注册职么开门帐号，包括但不限于以牟利、炒作、套现等为目的多个帐号帐号注册。用户亦不得盗用其他用户帐号。
            </Text>
          </View>

          <View style={{ paddingHorizontal: CSS.pixel(20) }}>
            <Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMain,
                fontWeight: sdStyles.SDFontBold,
              }}
            >
              二、服务内容
            </Text>
            <Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(40, true),
                marginBottom: CSS.pixel(2, true)
              }}
            >
            1、 本服务的具体内容由善读数据职么开门根据实际情况提供，包括但不限于授权用户通过其帐号进行历史就业数据查询、资讯浏览、未来职业规划制定、成长任务打卡、发布动态等。职么开门善读数据可以对其提供的服务予以变更，且职么开门善读数据提供的服务内容可能随时变更；用户将会收到职么开门善读数据关于服务变更的通知。
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true)
              }}
            >2、	善读数据的服务目前均为免费服务，若后期增加收费服务功能，将另行通知。
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true)
              }}
            >3、	善读数据会尽最大努力向您提供服务，确保服务的连贯性和安全性；但善读数据不能随时预见和防范法律、技术以及其他风险，包括但不限于不可抗力、病毒、木马、黑客攻击、系统不稳定、第三方服务瑕疵、政府行为等原因可能导致的服务中断、数据丢失以及其他的损失和风险。对于任何用户信息或个人化设定的时效、删除、传递错误、未予储存或其它任何问题，善读数据均不承担任何责任。善读数据保留不经事先通知为升级、维护或其它目的暂停本服务全部或任何部分的权利。
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true)
              }}
            >4、	除您与善读数据另行书面约定外，善读数据保留随时停止、修改或中断服务而不需通知您的权利。善读数据不需就此对用户或第三方负责。
  </Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true)
              }}
            >5、	请您理解，善读数据仅提供相关的服务，除此之外与相关服务有关的设备（如个人电脑、手机、及其他与接入互联网或移动网有关的装置）及所需的费用（如为接入互联网而支付的电话费及上网费、为使用移动网而支付的手机费）均应由用户自行负担。您理解并同意，您使用本服务时会耗用您的终端设备和带宽等资源。
  </Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true)
              }}
            >6、	您同意善读数据可以在提供服务的过程中自行或由第三方广告商向您发送广告、推广或宣传信息（包括商业与非商业信息），其方式和范围可不经向您特别通知而变更。善读数据可能为您提供选择停止接受广告信息的功能或渠道，但任何时候您都不得以本协议未明确约定或善读数据未书面许可的方式屏蔽、过滤广告信息。同时，您应当自行判断广告信息的真实性并为自己的判断行为负责，除法律明确规定外，您因依照该广告信息进行的交易或前述广告商提供的内容而遭受的损失或损害，善读数据不承担责任。
  </Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true)
              }}
            >7、	善读数据依法为用户提供本服务，但是用户应对其使用本服务自行承担责任及风险，善读数据在任何情况下不就用户因使用或不能使用职么开门善读数据提供的服务所发生的特殊的、意外的、直接或间接的损失承担赔偿责任。
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(62, true)
              }}
            >8、  未经善读数据书面同意，用户不能利用本服务进行销售或开展其他商业性行为，如用户有需要将服务用于商业用途，应书面通知善读数据并获得善读数据的明确授权。如用户违反此约定，善读数据将依法追究用户的违约责任，由此给善读数据造成损失的，善读数据有权主张损害赔偿，该等赔偿包括但不限于直接损失和可得利益损失。
            </Text>
          </View>
          <View style={{ paddingHorizontal: CSS.pixel(20) }}>
            <Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMain,
                fontWeight: sdStyles.SDFontBold,
              }}
            >
              三、用户个人隐私信息保护
            </Text>
            <Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(40, true),
                marginBottom: CSS.pixel(2, true)
              }}
            >
            1、用户在注册帐号或使用本服务的过程中，可能需要填写或提交一些必要的信息，如法律法规、规章规范性文件（以下称“法律法规”）规定的需要填写的身份信息。如用户提交的信息不完整或不符合法律法规的规定，则用户无法使用本服务或在使用本服务的过程中受到限制。
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true)
              }}
            >2、个人隐私信息是指涉及用户个人身份或个人隐私的信息，比如，用户真实姓名、身份证信息号、手机号码、手机设备识别码、IP地址。非个人隐私信息是指用户对本服务的操作状态以及使用习惯等明确且客观反映在职么开门服务器端的基本记录信息、个人隐私信息范围外的其它普通信息，以及用户同意公开的上述隐私信息。
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true)
              }}
            >3、尊重用户个人隐私信息的私有性是善读数据职么开门的一贯制度，善读数据职么开门将采取技术措施和其他必要措施，确保用户个人隐私信息安全，防止在本服务中收集的用户个人隐私信息泄露、毁损或丢失。在发生前述情形或者善读数据发现存在发生前述情形的可能时，将及时采取补救措施。但善读数据不应当为非因善读数据故意或重大过失（包括但不限于不可抗力因素或第三方过失造成的原因）而发生的个人信息泄露、丢失、毁损承担任何法律责任。
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true)
              }}
            >4、职么开门善读数据未经用户同意不向任何第三方公开、 透露用户个人隐私信息。但以下特定情形除外：
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true),
                marginHorizontal: CSS.pixel(40),
              }}
            >(1) 职么开门善读数据根据法律法规规定或有权机关的指示提供用户的个人隐私信息；
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true),
                marginHorizontal: CSS.pixel(40),
              }}
            >(2) 由于用户将其用户密码告知他人或与他人共享注册帐户与密码，由此导致的任何个人信息的泄漏，或其他原因导致的个人隐私信息的泄露；
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true),
                marginHorizontal: CSS.pixel(40),
              }}
            >(3) 用户自行向第三方公开其个人隐私信息；
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true),
                marginHorizontal: CSS.pixel(40),
              }}
            >(4) 用户与善读数据职么开门及合作单位之间就用户个人隐私信息的使用公开达成约定，善读数据职么开门因此向合作单位公开用户个人隐私信息；
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true),
                marginHorizontal: CSS.pixel(40),
              }}
            >(5) 任何由于黑客攻击、电脑病毒侵入及其他不可抗力事件导致用户个人隐私信息的泄露。
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true)
              }}
            >5、用户同意善读数据职么开门可在以下事项中使用用户的个人隐私信息：
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true),
                marginHorizontal: CSS.pixel(40),
              }}
            >(1) 善读数据职么开门向用户及时发送重要通知，如软件更新、本协议条款的变更；
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true),
                marginHorizontal: CSS.pixel(40),
              }}
            >(2) 善读数据职么开门内部进行审计、数据分析和研究等，以改进产品、服务和与用户之间的沟通；
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true),
                marginHorizontal: CSS.pixel(40),
              }}
            >(3) 依本协议约定，善读数据职么开门管理、审查用户信息及进行处理措施；
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true),
                marginHorizontal: CSS.pixel(40),
              }}
            >(4) 适用法律法规规定的其他事项。
除上述事项外，如未取得用户事先同意，善读数据职么开门不会将用户个人隐私信息使用于任何其他用途。
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true)
              }}
            >6、用户成功注册“职么开门”帐号视为确认授权职么开门善读数据提取、公开及使用用户学校、专业等信息。用户学校、专业等信息将作为用户公开资料之一，由职么开门善读数据向其他用户公开。如用户需要终止向其他用户公开其地理位置信息，可随时退出软件服务注销账户不再使用服务。
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(62, true)
              }}
            >7、为了改善职么开门的技术和服务，向用户提供更好的服务体验，职么开门善读数据或可能会自行收集使用或向第三方提供用户的非个人隐私信息，用户在此不可撤销的给予善读数据该等授权且该等授权的期限应当延续至用户注销“职么开门“账户为止。
            </Text>
          </View>
          <View style={{ paddingHorizontal: CSS.pixel(20) }}>
            <Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMain,
                fontWeight: sdStyles.SDFontBold,
              }}
            >
              四、内容规范
            </Text>
            <Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(40, true),
                marginBottom: CSS.pixel(2, true)
              }}
            >
            1、本条所述内容是指用户使用本服务过程中所制作、上载、复制、发布、传播的任何内容，包括但不限于帐号头像、名称、用户说明等注册信息及认证资料，或文字、图片、图文等发送以及其他使用帐号或本服务所产生的内容。
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true),
              }}
            >2、用户不得利用“职么开门”帐号或本服务制作、上载、复制、发布、传播如下法律、法规和政策禁止的内容，包括但不限于：
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true),
                marginHorizontal: CSS.pixel(40),
              }}
            >(1) 反对宪法所确定的基本原则的；
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true),
                marginHorizontal: CSS.pixel(40),
              }}
            >(2) 危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true),
                marginHorizontal: CSS.pixel(40),
              }}
            >(3) 损害国家荣誉和利益的；
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true),
                marginHorizontal: CSS.pixel(40),
              }}
            >(4) 煽动民族仇恨、民族歧视，破坏民族团结的；
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true),
                marginHorizontal: CSS.pixel(40),
              }}
            >(5) 破坏国家宗教政策，宣扬邪教和封建迷信的；
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true),
                marginHorizontal: CSS.pixel(40),
              }}
            >(6) 散布谣言，扰乱社会秩序，破坏社会稳定的；
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true),
                marginHorizontal: CSS.pixel(40),
              }}
            >(7) 散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true),
                marginHorizontal: CSS.pixel(40),
              }}
            >(8) 侮辱或者诽谤他人，侵害他人合法权益的；
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true),
                marginHorizontal: CSS.pixel(40),
              }}
            >(9) 不遵守法律法规底线、社会主义制度底线、国家利益底线、公民合法权益底线、社会公共秩序底线、道德风尚底线和信息真实性底线的“七条底线”要求的；
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true),
                marginHorizontal: CSS.pixel(40),
              }}
            >(10) 含有法律、行政法规禁止的其他内容的信息。
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true),
              }}
            >3、用户不得利用“职么开门”帐号或本服务制作、上载、复制、发布、传播如下干扰“职么开门”正常运营，以及侵犯其他用户或第三方合法权益的内容，包括但不限于：
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true),
                marginHorizontal: CSS.pixel(40),
              }}
            >(1) 含有任何性或性暗示的；
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true),
                marginHorizontal: CSS.pixel(40),
              }}
            >(2) 含有辱骂、恐吓、威胁内容的；
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true),
                marginHorizontal: CSS.pixel(40),
              }}
            >(3) 含有骚扰、垃圾广告、恶意信息、诱骗信息的；
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true),
                marginHorizontal: CSS.pixel(40),
              }}
            >(4) 涉及他人隐私、个人信息或资料的；
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true),
                marginHorizontal: CSS.pixel(40),
              }}
            >(5) 侵害他人名誉权、肖像权、知识产权、商业秘密等合法权利的；
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true),
                marginHorizontal: CSS.pixel(40),
              }}
            >(6) 含有其他干扰本服务正常运营和侵犯其他用户或第三方合法权益内容的信息。
            </Text>
          </View>

          <View style={{ paddingHorizontal: CSS.pixel(20) }}>
            <Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMain,
                fontWeight: sdStyles.SDFontBold,
              }}
            >
              五、使用规则
            </Text>
            <Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(40, true),
                marginBottom: CSS.pixel(2, true)
              }}
            >
            1、用户在本服务中或通过本服务所传送、发布的任何内容仅代表其自身立场和观点，并不反映或代表，也不得被视为反映或代表职么开门或善读数据的观点、立场或政策，善读数据职么开门对此不承担任何责任。
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true),
              }}
            >2、用户不得利用“职么开门”帐号或本服务进行可能侵犯他方权益的如下行为，包括但不限于：
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true),
                marginHorizontal: CSS.pixel(40),
              }}
            >(1) 提交、发布虚假信息，或盗用他人头像或资料，冒充、利用他人名义的；
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true),
                marginHorizontal: CSS.pixel(40),
              }}
            >(2) 强制、诱导其他用户关注、点击链接页面或分享信息的；
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true),
                marginHorizontal: CSS.pixel(40),
              }}
            >(3) 虚构事实、隐瞒真相以误导、欺骗他人的；
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true),
                marginHorizontal: CSS.pixel(40),
              }}
            >(4) 利用技术手段批量建立虚假帐号的；
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true),
                marginHorizontal: CSS.pixel(40),
              }}
            >(5) 利用“职么开门”帐号或本服务从事任何违法犯罪活动的；
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true),
                marginHorizontal: CSS.pixel(40),
              }}
            >(6) 制作、发布与以上行为相关的方法、工具，或对此类方法、工具进行运营或传播，无论这些行为是否为商业目的；
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true),
                marginHorizontal: CSS.pixel(40),
              }}
            >(7) 其他违反法律法规规定、侵犯其他用户合法权益、干扰职么开门正常运营未明示授权的行为。
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(62, true),
              }}
            >3、用户须对利用“职么开门”帐号或本服务传送信息的真实性、合法性、无害性、准确性、有效性等全权负责，与用户所传播的信息相关的任何法律责任由用户自行承担，与善读数据职么开门无关。如因此给善读数据职么开门造成损害的，用户应当依法予以赔偿。
            </Text>
          </View>
          <View style={{ paddingHorizontal: CSS.pixel(20) }}>
            <Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMain,
                fontWeight: sdStyles.SDFontBold,
              }}
            >
              六、账户管理
            </Text>
            <Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(40, true),
                marginBottom: CSS.pixel(2, true)
              }}
            >
             1、 “职么开门”帐号的所有权归职么开门善读数据所有，用户完成申请注册手续后，获得“职么开门”帐号的使用权，该使用权仅属于初始申请注册人，禁止赠与、借用、租用、转让或售卖。善读数据职么开门因经营需要，有权无偿回收用户的“职么开门”帐号。用户理解并接受善读数据对该帐号帐号的授权仅限于用户个人非商业、不可转让及非排他性的使用，善读数据有权根据实际情况暂时封停或永久查封此帐号帐号，且仅可为访问或使用本服务的目的而使用该帐号帐号。
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true),
              }}
            >2、用户可以更改、删除“职么开门”帐户上的个人资料、注册信息及传送内容等，但需注意，删除有关信息的同时也会删除用户储存在系统中的文字和图片。用户需承担该风险。
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true),
              }}
            >3、用户有责任妥善保管注册帐号信息及帐号密码的安全，因用户保管不善可能导致遭受盗号或密码失窃，责任由用户自行承担。用户需要对注册帐号以及密码下的行为承担法律责任。用户同意在任何情况下不使用其他用户的帐号或密码。在用户怀疑他人使用其帐号或密码时，用户同意立即通知善读数据职么开门，否则未经授权的使用行为均视为用户本人行为。。
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(62, true),
              }}
            >4、用户应遵守本协议的各项条款，正确、适当地使用本服务，如因用户违反本协议中的任何条款，善读数据职么开门在通知用户后有权依据协议中断或终止对违约用户“职么开门”帐号提供服务。同时，职么开门善读数据保留在任何时候无偿收回“职么开门”帐号、用户名的权利。
            如用户注册“职么开门”帐号后连续一年不登录，通知用户后，职么开门善读数据有权可以收回该帐号且无需通知用户，以免造成资源浪费，该帐号帐号名有可能会被新的用户注册，由	此造成的不利后果由用户自行承担。
            </Text>
          </View>
          <View style={{ paddingHorizontal: CSS.pixel(20) }}>
            <Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMain,
                fontWeight: sdStyles.SDFontBold,
              }}
            >
              七、数据储存
            </Text>
            <Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(40, true),
                marginBottom: CSS.pixel(2, true)
              }}
            >
              1、善读数据不对用户在本服务中相关数据的删除或储存失败负责。
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true),
              }}
            >2、善读数据职么开门可以根据实际情况自行决定用户在本服务中数据的最长储存期限，并在服务器上为其分配数据最大存储空间等。用户可根据自己的需要自行备份本服务中的相关数据。

</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(62, true),
              }}
            >3、如用户停止使用本服务或本服务终止，善读数据职么开门可以从服务器上永久地删除用户的数据。本服务停止、终止后，善读数据职么开门没有义务向用户返还任何数据。
            </Text>
          </View>
          <View style={{ paddingHorizontal: CSS.pixel(20) }}>
            <Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMain,
                fontWeight: sdStyles.SDFontBold,
              }}
            >
              八、风险承担
            </Text>
            <Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(40, true),
                marginBottom: CSS.pixel(2, true)
              }}
            >
            1、用户理解并同意，“职么开门”是仅为用户提供信息分享、传送及获取的平台，用户必须为自己注册帐号下的一切行为负责，包括用户所传送的任何内容以及由此产生的任何后果。用户应对“职么开门”及本服务中的内容自行加以判断，并承担因使用内容而引起的所有风险，包括因对内容的正确性、完整性或实用性的依赖而产生的风险。职么开门善读数据无法且不会对因用户行为而导致的任何损失或损害承担责任。
如果用户发现任何人违反本协议约定或以其他不当的方式使用本服务，请立即向职么开门善读数据举报或投诉，职么开门善读数据将依本协议约定进行处理。
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(62, true),
              }}
            >2、用户理解并同意，因业务发展需要，职么开门善读数据保留不经通知用户单方面对本服务的全部或部分服务内容变更、暂停、终止或撤销的权利，用户需承担此风险。
            </Text>
          </View>
          <View style={{ paddingHorizontal: CSS.pixel(20) }}>
            <Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMain,
                fontWeight: sdStyles.SDFontBold,
              }}
            >
              九、知识产权声明
            </Text>
            <Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(40, true),
                marginBottom: CSS.pixel(2, true)
              }}
            >
              1、除本服务中涉及广告的知识产权由相应广告商享有外，职么开门善读数据在本服务中提供的内容（包括但不限于网页、文字、图片、音频、视频、图表等）的知识产权均归善读数据职么开门所有，但用户在使用本服务前对自己发布的内容已合法取得知识产权的除外。
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true),
              }}
            >2、除另有特别声明外，善读数据职么开门提供本服务时所依托软件的著作权、专利权及其他知识产权均归善读数据职么开门所有。
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true),
              }}
            >3、善读数据职么开门在本服务中所涉及的图形、文字或其组成，以及其他“职么开门“相关的标志及产品、服务名称（以下统称“职么开门标识”），其著作权或商标权归职么开门善读数据所有。未经善读数据职么开门事先书面同意，用户不得将职么开门标识以任何方式展示或使用或作其他处理，也不得向他人表明用户有权展示、使用、或其他有权处理职么开门标识的行为。
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true),
              }}
            >4、上述及其他任何善读数据职么开门或相关广告商依法拥有的知识产权均受到法律保护，未经善读数据职么开门或相关广告商书面许可，用户不得以任何形式进行使用或创造相关衍生作品。
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(62, true),
              }}
            >5、对于用户在任何时间、任何地点使用职么开门服务时发表的任何形式的文字、图片等内容，用户在此同意将其著作权免费授予善读数据，该等权利包括但不限于：复制权、发行权、出租权、展览权、表演权、放映权、广播权、信息网络传播权、摄制权、改编权、翻译权、汇编权等权益。用户在此明确许可善读数据有权就任何主体的侵权行为独立维权并获得赔偿，维权形式包括但不限于发送侵权通告函件、发起诉讼、申请仲裁等方式。用户进一步明确，善读数据对于上述所有授权有权进行转授权。
            </Text>
          </View>
          <View style={{ paddingHorizontal: CSS.pixel(20) }}>
            <Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMain,
                fontWeight: sdStyles.SDFontBold,
              }}
            >
              十、法律责任
            </Text>
            <Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(40, true),
                marginBottom: CSS.pixel(2, true)
              }}
            >
            1、如果善读数据职么开门发现或收到他人举报或投诉用户违反本协议约定的，善读数据职么开门有权不经通知随时对相关内容，包括但不限于用户资料、聊天记录进行审查、删除，并视情节轻重对违规帐号处以包括但不限于警告、帐号封禁 、设备封禁 、功能封禁 的处罚，且无需通知用户处理结果。
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true),
              }}
            >2、用户理解并同意，善读数据职么开门有权依合理判断对违反有关法律法规或本协议规定的行为进行处罚，对违法违规的任何用户采取适当的法律行动，并依据法律法规保存有关信息向有关部门报告等，用户应承担由此而产生的一切法律责任。
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(62, true),
              }}
            >3、用户理解并同意，因用户违反本协议约定，导致或产生的任何第三方主张的任何索赔、要求或损失，包括合理的律师费，用户应当赔偿善读数据职么开门与合作公司、关联公司，并使之免受损害。
            </Text>
          </View>
          <View style={{ paddingHorizontal: CSS.pixel(20) }}>
            <Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMain,
                fontWeight: sdStyles.SDFontBold,
              }}
            >

十一、不可抗力及其他免责事由
            </Text>
            <Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(40, true),
                marginBottom: CSS.pixel(2, true)
              }}
            >1、用户理解并确认，在使用本服务的过程中，可能会遇到不可抗力等风险因素，使本服务发生中断。不可抗力是指不能预见、不能克服并不能避免且对一方或双方造成重大影响的客观事件，包括但不限于自然灾害如洪水、地震、瘟疫流行和风暴等以及社会事件如战争、动乱、政府行为等。出现上述情况时，善读数据职么开门将努力在第一时间与相关单位配合，及时进行修复，但是由此给用户或第三方造成的损失，善读数据职么开门及合作单位在法律允许的范围内免责。
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true),
              }}
            >2、本服务同大多数互联网服务一样，受包括但不限于用户原因、网络服务质量、社会环境等因素的差异影响，可能受到各种安全问题的侵扰，如他人利用用户的资料，造成现实生活中的骚扰；用户下载安装的其它软件或访问的其他网站中含有“特洛伊木马”等病毒，威胁到用户的计算机信息和数据的安全，继而影响本服务的正常使用等等。用户应加强信息安全及使用者资料的保护意识，要注意加强密码保护，以免遭致损失和骚扰，且不得以此为理由追究善读数据的责任。
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true),
              }}
            >3、用户理解并确认，本服务存在因不可抗力、计算机病毒或黑客攻击、系统不稳定、用户所在位置、用户关机以及其他任何技术、互联网络、通信线路原因等造成的服务中断或不能满足用户要求的风险，因此导致的用户或第三方任何损失，善读数据职么开门不承担任何责任。
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true),
              }}
            >4、用户理解并确认，在使用本服务过程中存在来自任何他人的包括误导性的、欺骗性的、威胁性的、诽谤性的、令人反感的或非法的信息，或侵犯他人权利的匿名或冒名的信息，以及伴随该等信息的行为，因此导致的用户或第三方的任何损失，善读数据职么开门不承担任何责任。
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true),
              }}
            >5、用户理解并确认，善读数据职么开门需要定期或不定期地对“职么开门”平台或相关的设备进行检修或者维护，如因此类情况而造成服务在合理时间内的中断，善读数据职么开门无需为此承担任何责任，但职么开门应事先进行通告。
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true),
              }}
            >6、善读数据职么开门依据法律法规、本协议约定获得处理违法违规或违约内容的权利，该权利不构成善读数据职么开门的义务或承诺，善读数据职么开门不能保证及时发现违法违规或违约行为或进行相应处理。
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true),
              }}
            >7、用户理解并确认，对于善读数据职么开门向用户提供的下列产品或者服务的质量缺陷及其引发的任何损失，职么开门善读数据无需承担任何责任：
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true),
                marginHorizontal: CSS.pixel(40),
              }}
            >(1) 职么开门向用户免费提供的服务；
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true),
                marginHorizontal: CSS.pixel(40),
              }}
            >(2) 职么开门向用户赠送的任何产品或者服务。
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(62, true),
              }}
            >8、在任何情况下，善读数据职么开门均不对任何间接性、后果性、惩罚性、偶然性、特殊性或刑罚性的损害，包括因用户使用“职么开门”或本服务而遭受的利润损失，承担责任（即使职么开门善读数据已被告知该等损失的可能性亦然）。尽管本协议中可能含有相悖的规定，善读数据职么开门对用户承担的全部责任，无论因何原因或何种行为方式，始终不超过用户因使用职么开门提供的服务而支付给善读数据职么开门的费用(如有)。
            </Text>
          </View>
          <View style={{ paddingHorizontal: CSS.pixel(20) }}>
            <Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMain,
                fontWeight: sdStyles.SDFontBold,
              }}
            >
              十二、服务的变更、中断、终止
            </Text>
            <Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(40, true),
                marginBottom: CSS.pixel(2, true)
              }}
            >
             1、鉴于网络服务的特殊性，用户同意职么开门善读数据有权随时变更、中断或终止部分或全部的服务。善读数据职么开门变更、中断或终止的服务，职么开门应当在变更、中断或终止之前无需通知用户，用户同意善读数据有权行使上述权利且不需对用户或第三方承担任何责任。。
 </Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true),
              }}
            >2、如发生下列任何一种情形，善读数据职么开门有权变更、中断或终止向用户提供的免费服务或收费服务，而无需对用户或任何第三方承担任何责任：
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true),
                marginHorizontal: CSS.pixel(40),
              }}
            >(1) 根据法律规定用户应提交真实信息，而用户提供的个人资料不真实、或与注册时信息不一致又未能提供合理证明；
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true),
                marginHorizontal: CSS.pixel(40),
              }}
            >(2) 用户违反相关法律法规或本协议的约定；
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true),
                marginHorizontal: CSS.pixel(40),
              }}
            >(3) 按照法律规定或有权机关的要求；
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(62, true),
                marginHorizontal: CSS.pixel(40),
              }}
            >(4) 出于安全的原因或其他必要的情形。
            </Text>
          </View>
          <View style={{ paddingHorizontal: CSS.pixel(20) }}>
            <Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMain,
                fontWeight: sdStyles.SDFontBold,
              }}
            >
              十三、其他
            </Text>
            <Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(40, true),
                marginBottom: CSS.pixel(2, true)
              }}
            >
            1、善读数据职么开门郑重提醒用户注意本协议中免除善读数据职么开门责任和限制用户权利的条款，请用户仔细阅读，自主考虑风险。未成年人应在法定监护人的陪同下阅读本协议。
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true),
              }}
            >2、本协议的效力、解释及纠纷的解决，适用于中华人民共和国法律。若用户和善读数据职么开门之间发生任何纠纷或争议，首先应友好协商解决，协商不成的，用户同意将纠纷或争议提交职么开门善读数据住所地有管辖权的人民法院管辖。
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true),
              }}
            >3、本协议的任何条款无论因何种原因无效或不具可执行性，其余条款仍有效，对双方具有约束力。善读数据对于本协议的任何条款具有最终解释权。
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(2, true),
              }}
            >4、善读数据行使、未能及时行使或者未充分行使本条款或者按照法律规定所享有的权利，不应被视为放弃该权利，也不影响善读数据在将来行使该权利。
</Text><Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 26,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(62, true),
              }}
            >5、本协议中的标题仅为方便而设，不作为解释本条款的依据。
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  }
}

export default ConnectWithActions((state, props) => ({}))(TosScreen);
