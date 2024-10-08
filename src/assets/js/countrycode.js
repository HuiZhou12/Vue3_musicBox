const countrycode = [
    {"label":"中国","en":"China","value":"+86"},
    {"label":"中国香港","en":"Hong Kong (SAR)","value":"+852"},
    {"label":"中国澳门","en":"Macao","value":"+853"},
    {"label":"中国台湾","en":"Taiwan","value":"+886"},
    {"label":"阿富汗","en":"Afghanistan","value":"+93"},
    {"label":"阿尔巴尼亚","en":"Albania","value":"+355"},
    {"label":"阿尔及利亚","en":"Algeria","value":"+213"},
    {"label":"美属萨摩亚","en":"American Samoa","value":"+684"},
    {"label":"安道尔","en":"Andorra","value":"+376"},
    {"label":"安哥拉","en":"Angola","value":"+244"},
    {"label":"安圭拉","en":"Anguilla","value":"+1264"},
    {"label":"南极洲","en":"Antarctica","value":"+672"},
    {"label":"安提瓜和巴布达","en":"Antigua and Barbuda","value":"+1268"},
    {"label":"阿根廷","en":"Argentina","value":"+54"},
    {"label":"亚美尼亚","en":"Armenia","value":"+374"},
    {"label":"阿鲁巴","en":"Aruba","value":"+297"},
    {"label":"澳大利亚","en":"Australia","value":"+61"},
    {"label":"奥地利","en":"Austria","value":"+43"},
    {"label":"阿塞拜疆","en":"Azerbaijan","value":"+994"},
    {"label":"巴林","en":"Bahrain","value":"+973"},
    {"label":"孟加拉国","en":"Bangladesh","value":"+880"},
    {"label":"巴巴多斯","en":"Barbados","value":"+1246"},
    {"label":"白俄罗斯","en":"Belarus","value":"+375"},
    {"label":"比利时","en":"Belgium","value":"+32"},
    {"label":"伯利兹","en":"Belize","value":"+501"},
    {"label":"贝宁","en":"Benin","value":"+229"},
    {"label":"百慕大","en":"Bermuda","value":"+1441"},
    {"label":"不丹","en":"Bhutan","value":"+975"},
    {"label":"玻利维亚","en":"Bolivia","value":"+591"},
    {"label":"波黑","en":"Bosnia and Herzegovina","value":"+387"},
    {"label":"博茨瓦纳","en":"Botswana","value":"+267"},
    {"label":"巴西","en":"Brazil","value":"+55"},
    {"label":"英属维尔京群岛","en":"British Virgin Islands","value":"+1284"},
    {"label":"文莱","en":"Brunei Darussalam","value":"+673"},
    {"label":"保加利亚","en":"Bulgaria","value":"+359"},
    {"label":"布基纳法索","en":"Burkina Faso","value":"+226"},
    {"label":"缅甸","en":"Burma","value":"+95"},
    {"label":"布隆迪","en":"Burundi","value":"+257"},
    {"label":"柬埔寨","en":"Cambodia","value":"+855"},
    {"label":"喀麦隆","en":"Cameroon","value":"+237"},
    {"label":"加拿大","en":"Canada","value":"+1"},
    {"label":"佛得角","en":"Cape Verde","value":"+238"},
    {"label":"开曼群岛","en":"Cayman Islands","value":"+1345"},
    {"label":"中非","en":"Central African Republic","value":"+236"},
    {"label":"乍得","en":"Chad","value":"+235"},
    {"label":"智利","en":"Chile","value":"+56"},
    {"label":"圣诞岛","en":"Christmas Island","value":"+61"},
    {"label":"科科斯（基林）群岛","en":"Cocos (Keeling) Islands","value":"+61"},
    {"label":"哥伦比亚","en":"Colombia","value":"+57"},
    {"label":"科摩罗","en":"Comoros","value":"+269"},
    {"label":"刚果（金）","en":"Democratic Republic of the Congo","value":"+243"},
    {"label":"刚果（布）","en":"Republic of the Congo","value":"+242"},
    {"label":"库克群岛","en":"Cook Islands","value":"+682"},
    {"label":"哥斯达黎加","en":"Costa Rica","value":"+506"},
    {"label":"科特迪瓦","en":"Cote d'Ivoire","value":"+225"},
    {"label":"克罗地亚","en":"Croatia","value":"+385"},
    {"label":"古巴","en":"Cuba","value":"+53"},
    {"label":"塞浦路斯","en":"Cyprus","value":"+357"},
    {"label":"捷克","en":"Czech Republic","value":"+420"},
    {"label":"丹麦","en":"Denmark","value":"+45"},
    {"label":"吉布提","en":"Djibouti","value":"+253"},
    {"label":"多米尼克","en":"Dominica","value":"+1767"},
    {"label":"多米尼加","en":"Dominican Republic","value":"+1809"},
    {"label":"厄瓜多尔","en":"Ecuador","value":"+593"},
    {"label":"埃及","en":"Egypt","value":"+20"},
    {"label":"萨尔瓦多","en":"El Salvador","value":"+503"},
    {"label":"赤道几内亚","en":"Equatorial Guinea","value":"+240"},
    {"label":"厄立特里亚","en":"Eritrea","value":"+291"},
    {"label":"爱沙尼亚","en":"Estonia","value":"+372"},
    {"label":"埃塞俄比亚","en":"Ethiopia","value":"+251"},
    {"label":"福克兰群岛（马尔维纳斯）","en":"Falkland Islands (Islas Malvinas)","value":"+500"},
    {"label":"法罗群岛","en":"Faroe Islands","value":"+298"},
    {"label":"斐济","en":"Fiji","value":"+679"},
    {"label":"芬兰","en":"Finland","value":"+358"},
    {"label":"法国","en":"France","value":"+33"},
    {"label":"法属圭亚那","en":"French Guiana","value":"+594"},
    {"label":"法属波利尼西亚","en":"French Polynesia","value":"+689"},
    {"label":"加蓬","en":"Gabon","value":"+241"},
    {"label":"格鲁吉亚","en":"Georgia","value":"+995"},
    {"label":"德国","en":"Germany","value":"+49"},
    {"label":"加纳","en":"Ghana","value":"+233"},
    {"label":"直布罗陀","en":"Gibraltar","value":"+350"},
    {"label":"希腊","en":"Greece","value":"+30"},
    {"label":"格陵兰","en":"Greenland","value":"+299"},
    {"label":"格林纳达","en":"Grenada","value":"+1473"},
    {"label":"瓜德罗普","en":"Guadeloupe","value":"+590"},
    {"label":"关岛","en":"Guam","value":"+1671"},
    {"label":"危地马拉","en":"Guatemala","value":"+502"},
    {"label":"根西岛","en":"Guernsey","value":"+1481"},
    {"label":"几内亚","en":"Guinea","value":"+224"},
    {"label":"几内亚比绍","en":"Guinea-Bissau","value":"+245"},
    {"label":"圭亚那","en":"Guyana","value":"+592"},
    {"label":"海地","en":"Haiti","value":"+509"},
    {"label":"梵蒂冈","en":"Holy See (Vatican City)","value":"+379"},
    {"label":"洪都拉斯","en":"Honduras","value":"+504"},
    {"label":"匈牙利","en":"Hungary","value":"+36"},
    {"label":"冰岛","en":"Iceland","value":"+354"},
    {"label":"印度","en":"India","value":"+91"},
    {"label":"印度尼西亚","en":"Indonesia","value":"+62"},
    {"label":"伊朗","en":"Iran","value":"+98"},
    {"label":"伊拉克","en":"Iraq","value":"+964"},
    {"label":"爱尔兰","en":"Ireland","value":"+353"},
    {"label":"以色列","en":"Israel","value":"+972"},
    {"label":"意大利","en":"Italy","value":"+39"},
    {"label":"牙买加","en":"Jamaica","value":"+1876"},
    {"label":"日本","en":"Japan","value":"+81"},
    {"label":"约旦","en":"Jordan","value":"+962"},
    {"label":"哈萨克斯坦","en":"Kazakhstan","value":"+73"},
    {"label":"肯尼亚","en":"Kenya","value":"+254"},
    {"label":"基里巴斯","en":"Kiribati","value":"+686"},
    {"label":"朝鲜","en":"North Korea","value":"+850"},
    {"label":"韩国","en":"South Korea","value":"+82"},
    {"label":"科威特","en":"Kuwait","value":"+965"},
    {"label":"吉尔吉斯斯坦","en":"Kyrgyzstan","value":"+996"},
    {"label":"老挝","en":"Laos","value":"+856"},
    {"label":"拉脱维亚","en":"Latvia","value":"+371"},
    {"label":"黎巴嫩","en":"Lebanon","value":"+961"},
    {"label":"莱索托","en":"Lesotho","value":"+266"},
    {"label":"利比里亚","en":"Liberia","value":"+231"},
    {"label":"利比亚","en":"Libya","value":"+218"},
    {"label":"列支敦士登","en":"Liechtenstein","value":"+423"},
    {"label":"立陶宛","en":"Lithuania","value":"+370"},
    {"label":"卢森堡","en":"Luxembourg","value":"+352"},
    {"label":"前南马其顿","en":"The Former Yugoslav Republic of Macedonia","value":"+389"},
    {"label":"马达加斯加","en":"Madagascar","value":"+261"},
    {"label":"马拉维","en":"Malawi","value":"+265"},
    {"label":"马来西亚","en":"Malaysia","value":"+60"},
    {"label":"马尔代夫","en":"Maldives","value":"+960"},
    {"label":"马里","en":"Mali","value":"+223"},
    {"label":"马耳他","en":"Malta","value":"+356"},
    {"label":"马绍尔群岛","en":"Marshall Islands","value":"+692"},
    {"label":"马提尼克","en":"Martinique","value":"+596"},
    {"label":"毛里塔尼亚","en":"Mauritania","value":"+222"},
    {"label":"毛里求斯","en":"Mauritius","value":"+230"},
    {"label":"马约特","en":"Mayotte","value":"+269"},
    {"label":"墨西哥","en":"Mexico","value":"+52"},
    {"label":"密克罗尼西亚","en":"Federated States of Micronesia","value":"+691"},
    {"label":"摩尔多瓦","en":"Moldova","value":"+373"},
    {"label":"摩纳哥","en":"Monaco","value":"+377"},
    {"label":"蒙古","en":"Mongolia","value":"+976"},
    {"label":"蒙特塞拉特","en":"Montserrat","value":"+1664"},
    {"label":"摩洛哥","en":"Morocco","value":"+212"},
    {"label":"莫桑比克","en":"Mozambique","value":"+258"},
    {"label":"纳米尼亚","en":"Namibia","value":"+264"},
    {"label":"瑙鲁","en":"Nauru","value":"+674"},
    {"label":"尼泊尔","en":"Nepal","value":"+977"},
    {"label":"荷兰","en":"Netherlands","value":"+31"},
    {"label":"荷属安的列斯","en":"Netherlands Antilles","value":"+599"},
    {"label":"新喀里多尼亚","en":"New Caledonia","value":"+687"},
    {"label":"新西兰","en":"New Zealand","value":"+64"},
    {"label":"尼加拉瓜","en":"Nicaragua","value":"+505"},
    {"label":"尼日尔","en":"Niger","value":"+227"},
    {"label":"尼日利亚","en":"Nigeria","value":"+234"},
    {"label":"纽埃","en":"Niue","value":"+683"},
    {"label":"诺福克岛","en":"Norfolk Island","value":"+6723"},
    {"label":"北马里亚纳","en":"Northern Mariana Islands","value":"+1"},
    {"label":"挪威","en":"Norway","value":"+47"},
    {"label":"阿曼","en":"Oman","value":"+968"},
    {"label":"巴基斯坦","en":"Pakistan","value":"+92"},
    {"label":"帕劳","en":"Palau","value":"+680"},
    {"label":"巴拿马","en":"Panama","value":"+507"},
    {"label":"巴布亚新几内亚","en":"Papua New Guinea","value":"+675"},
    {"label":"巴拉圭","en":"Paraguay","value":"+595"},
    {"label":"秘鲁","en":"Peru","value":"+51"},
    {"label":"菲律宾","en":"Philippines","value":"+63"},
    {"label":"波兰","en":"Poland","value":"+48"},
    {"label":"葡萄牙","en":"Portugal","value":"+351"},
    {"label":"波多黎各","en":"Puerto Rico","value":"+1809"},
    {"label":"卡塔尔","en":"Qatar","value":"+974"},
    {"label":"留尼汪","en":"Reunion","value":"+262"},
    {"label":"罗马尼亚","en":"Romania","value":"+40"},
    {"label":"俄罗斯","en":"Russia","value":"+7"},
    {"label":"卢旺达","en":"Rwanda","value":"+250"},
    {"label":"圣赫勒拿","en":"Saint Helena","value":"+290"},
    {"label":"圣基茨和尼维斯","en":"Saint Kitts and Nevis","value":"+1869"},
    {"label":"圣卢西亚","en":"Saint Lucia","value":"+1758"},
    {"label":"圣皮埃尔和密克隆","en":"Saint Pierre and Miquelon","value":"+508"},
    {"label":"圣文森特和格林纳丁斯","en":"Saint Vincent and the Grenadines","value":"+1784"},
    {"label":"萨摩亚","en":"Samoa","value":"+685"},
    {"label":"圣马力诺","en":"San Marino","value":"+378"},
    {"label":"圣多美和普林西比","en":"Sao Tome and Principe","value":"+239"},
    {"label":"沙特阿拉伯","en":"Saudi Arabia","value":"+966"},
    {"label":"塞内加尔","en":"Senegal","value":"+221"},
    {"label":"塞尔维亚和黑山","en":"Serbia and Montenegro","value":"+381"},
    {"label":"塞舌尔","en":"Seychelles","value":"+248"},
    {"label":"塞拉利","en":"Sierra Leone","value":"+232"},
    {"label":"新加坡","en":"Singapore","value":"+65"},
    {"label":"斯洛伐克","en":"Slovakia","value":"+421"},
    {"label":"斯洛文尼亚","en":"Slovenia","value":"+386"},
    {"label":"所罗门群岛","en":"Solomon Islands","value":"+677"},
    {"label":"索马里","en":"Somalia","value":"+252"},
    {"label":"南非","en":"South Africa","value":"+27"},
    {"label":"西班牙","en":"Spain","value":"+34"},
    {"label":"斯里兰卡","en":"Sri Lanka","value":"+94"},
    {"label":"苏丹","en":"Sudan","value":"+249"},
    {"label":"苏里南","en":"Suriname","value":"+597"},
    {"label":"斯瓦尔巴岛和扬马延岛","en":"Svalbard","value":"+47"},
    {"label":"斯威士兰","en":"Swaziland","value":"+268"},
    {"label":"瑞典","en":"Sweden","value":"+46"},
    {"label":"瑞士","en":"Switzerland","value":"+41"},
    {"label":"叙利亚","en":"Syria","value":"+963"},
    {"label":"塔吉克斯坦","en":"Tajikistan","value":"+992"},
    {"label":"坦桑尼亚","en":"Tanzania","value":"+255"},
    {"label":"泰国","en":"Thailand","value":"+66"},
    {"label":"巴哈马","en":"The Bahamas","value":"+1242"},
    {"label":"冈比亚","en":"The Gambia","value":"+220"},
    {"label":"多哥","en":"Togo","value":"+228"},
    {"label":"托克劳","en":"Tokelau","value":"+690"},
    {"label":"汤加","en":"Tonga","value":"+676"},
    {"label":"特立尼达和多巴哥","en":"Trinidad and Tobago","value":"+1868"},
    {"label":"突尼斯","en":"Tunisia","value":"+216"},
    {"label":"土耳其","en":"Turkey","value":"+90"},
    {"label":"土库曼斯坦","en":"Turkmenistan","value":"+993"},
    {"label":"特克斯和凯科斯群岛","en":"Turks and Caicos Islands","value":"+1649"},
    {"label":"图瓦卢","en":"Tuvalu","value":"+688"},
    {"label":"乌干达","en":"Uganda","value":"+256"},
    {"label":"乌克兰","en":"Ukraine","value":"+380"},
    {"label":"阿拉伯联合酋长国","en":"United Arab Emirates","value":"+971"},
    {"label":"英国","en":"United Kingdom","value":"+44"},
    {"label":"美国","en":"United States","value":"+1"},
    {"label":"乌拉圭","en":"Uruguay","value":"+598"},
    {"label":"乌兹别克斯坦","en":"Uzbekistan","value":"+998"},
    {"label":"瓦努阿图","en":"Vanuatu","value":"+678"},
    {"label":"委内瑞拉","en":"Venezuela","value":"+58"},
    {"label":"越南","en":"Vietnam","value":"+84"},
    {"label":"美属维尔京群岛","en":"Virgin Islands","value":"+1340"},
    {"label":"瓦利斯和富图纳","en":"Wallis and Futuna","value":"+681"},
    {"label":"也门","en":"Yemen","value":"+967"},
    {"label":"赞比亚","en":"Zambia","value":"+260"},
    {"label":"津巴布韦","en":"Zimbabwe","value":"+263"}];
    
    export default countrycode;