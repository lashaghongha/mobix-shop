namespace MobixAPI.Models;

public class BenefitItem
{
    public int Id       { get; set; }
    public string Icon  { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Sub   { get; set; } = string.Empty;
    public int Order    { get; set; }
}
