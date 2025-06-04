const supabase = require("../supabaseClient");

const PostModel = {
  getAll: async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },

  getById: async (id) => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  },

  create: async (title, content) => {
    const { data, error } = await supabase
      .from("posts")
      .insert({ title, content })
      .select()
      .single();
    if (error) throw error;
    return { id: data.id };
  },

  update: async (id, title, content) => {
    const { error, data } = await supabase
      .from("posts")
      .update({ title, content })
      .eq("id", id)
      .select();
    if (error) throw error;
    return { changes: data.length };
  },

  delete: async (id) => {
    const { error, data } = await supabase.from("posts").delete().eq("id", id);
    if (error) throw error;
    return { changes: data.length };
  },
};

module.exports = PostModel;
