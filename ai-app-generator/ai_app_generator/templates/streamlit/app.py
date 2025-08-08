import streamlit as st

st.set_page_config(page_title="{{ project_name }}")

st.title("{{ project_name }}")
st.write("{{ description or 'Hello from Streamlit!' }}")