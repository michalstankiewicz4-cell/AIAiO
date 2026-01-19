namespace AIproJect
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
            InitializeWebView();
        }

        private async void InitializeWebView()
        {
            await webView21.EnsureCoreWebView2Async();
            webView21.CoreWebView2.Navigate("https://copilot.microsoft.com/");
        }

        private void Form1_Load(object sender, EventArgs e)
        {

        }
    }
}
