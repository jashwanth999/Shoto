const SearchHeader = props => {
    return (
      <Header
        containerStyle={{
          backgroundColor: '#1d2533',
          borderBottomColor: 'none',
          height: 90,
        }}
        placement="left"
        centerComponent={
          <View style={styles.searchView}>
            <TextInput
              value={props.search}
              onChangeText={text => props.setSearch(text)}
              placeholderTextColor="grey"
              style={styles.searchInput}
              placeholder="Type Here"
            />
            <Ionicons
              onPress={() => {
                props.setIsSearch(!props.isSearch);
                props.setSearch('');
              }}
              style={{paddingRight: 5}}
              name="ios-close-outline"
              color="#d4d4d4"
              size={21}
            />
          </View>
        }
      />
    );
  };
  const MainHeader = props => {
    return (
      <Header
        containerStyle={{
          backgroundColor: '#1d2533',
          borderBottomColor: 'none',
          height: 90,
        }}
        leftComponent={<Avatar rounded source={{uri: props.profilepic}} />}
        centerComponent={
          <View style={styles.headerView}>
            <Text
              style={{
                color: '#d4d4d4',
                fontSize: 16,
                paddingTop: 10,
                fontWeight: 'bold',
              }}>
              Shoto.Click
            </Text>
          </View>
        }
        rightComponent={
          <MaterialIcons
            onPress={() => {
              props.setIsSearch(!props.isSearch);
            }}
            name="search"
            style={{marginTop: 4}}
            color="white"
            size={26}
          />
        }
      />
    );
  };