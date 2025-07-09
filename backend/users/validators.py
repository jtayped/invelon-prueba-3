def validate_preferences(pref_list):
    # ensure no duplicates
    if len(pref_list) != len(set(pref_list)):
        raise ValueError("Duplicated preferences")
    # ensure at least one even and one odd index
    par = [i for i in pref_list if i % 2 == 0]
    impar = [i for i in pref_list if i % 2 == 1]
    if not par or not impar:
        raise ValueError("Invalid preferences")
