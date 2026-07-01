namespace MobixAPI.Models;

public class AgentChat
{
    public int Id { get; set; }
    public string AgentId { get; set; } = string.Empty;
    public string Title { get; set; } = "ახალი ჩატი";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public List<AgentMessage> Messages { get; set; } = [];
}

public class AgentMessage
{
    public int Id { get; set; }
    public int ChatId { get; set; }
    public string Role { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string ActionsJson { get; set; } = "[]";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public AgentChat Chat { get; set; } = null!;
}
